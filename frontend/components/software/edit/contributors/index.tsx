import {useContext,useEffect,useState} from 'react'

import {app} from '../../../../config/app'
import useSnackbar from '../../../snackbar/useSnackbar'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'
import {Contributor, ContributorProps} from '../../../../types/Contributor'
import {
  addContributorToDb, deleteContributorsById,
  getAvatarUrl, getContributorsForSoftware,
  prepareContributorData, updateContributorInDb
} from '../../../../utils/editContributors'
import useOnUnsaveChange from '../../../../utils/useOnUnsavedChange'
import {getDisplayName} from '../../../../utils/getDisplayName'
import {sortOnStrProp} from '../../../../utils/sortFn'
import {getPropsFromObject} from '../../../../utils/getPropsFromObject'
import EditContributorModal from './EditContributorModal'
import FindContributor, {Name} from './FindContributor'
import SoftwareContributorsList from './SoftwareContributorsList'
import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext from '../editSoftwareContext'
import EditSectionTitle from '../EditSectionTitle'
import {contributorInformation as config} from '../editSoftwareConfig'
import {ModalProps,ModalStates} from '../editSoftwareTypes'

type EditContributorModal = ModalProps & {
  contributor?: Contributor
}

export default function SoftwareContributors({token}: {token: string }) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [loading, setLoading] = useState(true)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [modal, setModal] = useState<ModalStates<EditContributorModal>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })
  // we use pageState to enable/disable Save button in the header
  // extract from (shared) pageState
  const {isDirty,isValid} = pageState
  // watch for unsaved changes
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })

  useEffect(() => {
    let abort = false
    const getContributors = async (software:string,token:string) => {
      const resp = await getContributorsForSoftware({
        software,
        token,
        frontend:true
      })
      if (abort) return
      // update state
      setContributors(resp ?? [])
      setLoading(false)
    }
    if (software?.id && token) {
      getContributors(software.id,token)
    }
    return () => { abort = true }
  },[software?.id,token])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function updateContributorList({data, pos}: { data: Contributor, pos?: number }) {
    if (typeof pos == 'number') {
      // REPLACE existing item and sort
      const list = [
        ...contributors.slice(0, pos),
        data,
        ...contributors.slice(pos+1)
      ].sort((a,b)=>sortOnStrProp(a,b,'given_names'))
      // pass new list with addition contributor
      setContributors(list)
    } else {
      // ADD item and sort
      const list = [
        ...contributors,
        data
      ].sort((a,b)=>sortOnStrProp(a,b,'given_names'))
      setContributors(list)
    }
  }

  function onCreateNewContributor(name:Name) {
    const newContributor: Contributor = getPropsFromObject(name, ContributorProps)
    // set defaults
    newContributor.software = software?.id ?? ''
    newContributor.is_contact_person = false
    loadContributorIntoModal(newContributor)
  }

  async function onAddContributor(item: Contributor) {
    // update software id if missing
    if (item.software === '' &&
      software?.id &&
      software?.id !== '') {
      item.software = software?.id
    }
    // extract props into new object
    const contributor: Contributor = getPropsFromObject(item, ContributorProps)
    loadContributorIntoModal(contributor)
  }

  function loadContributorIntoModal(contributor: Contributor,pos?:number) {
    if (contributor) {
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          pos,
          contributor
        },
        delete: {
          open:false
        }
      })
    }
  }

  function onEditContributor(pos:number) {
    // select contributor
    const contributor = contributors[pos]
    loadContributorIntoModal(contributor,pos)
  }

  async function onSubmitContributor({data, pos}:{data:Contributor,pos?: number}) {
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
    // if id present we update
    if (data?.id) {
      const resp = await updateContributorInDb({data, token})
      if (resp.status === 200) {
        updateContributorList({data:resp.message,pos})
        // show notification
        showSuccessMessage(`Updated ${getDisplayName(data)}`)
      } else {
        showErrorMessage(`Failed to update ${getDisplayName(data)}. Error: ${resp.message}`)
      }
    } else {
      // this is completely new contributor we need to add to DB
      const contributor = prepareContributorData(data)
      const resp = await addContributorToDb({contributor, token})
      if (resp.status === 201) {
        // id of created record is provided in returned in message
        contributor.id = resp.message
        // remove avatar data
        contributor.avatar_data = null
        // construct url
        contributor.avatar_url = getAvatarUrl(contributor)
        // update contributors list
        updateContributorList({data:contributor})
      } else {
        showErrorMessage(`Failed to add ${getDisplayName(data)}. Error: ${resp.message}`)
      }
    }
  }

  function onDeleteContributor(pos:number) {
    const displayName = getDisplayName(contributors[pos]) ?? ''
    setModal({
      edit: {
        open: false
      },
      delete: {
        open: true,
        pos,
        displayName
      }
    })
  }

  async function deleteContributor(pos?: number) {
    // hide modals
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
    // abort if not specified
    if (typeof pos == 'number') {
      const contributor = contributors[pos]
      // existing contributor
      if (contributor.id) {
        // remove from database
        const ids = [contributor.id]
        const resp = await deleteContributorsById({ids, token})
        if (resp.status === 200) {
          // show notification
          showSuccessMessage(`Removed ${getDisplayName(contributor)} from ${pageState.software.brand_name}`)
          removeFromContributorList(pos)
        } else {
          showErrorMessage(`Failed to remove ${getDisplayName(contributor)}. Error: ${resp.message}`)
        }
      } else {
        // new contributor
        removeFromContributorList(pos)
      }
    }
  }

  function removeFromContributorList(pos: number) {
    // remove item from contributors list
    const list = [
      ...contributors.slice(0, pos),
      ...contributors.slice(pos+1)
    ]
    setContributors(list)
  }

  return (
    <>
      <EditSoftwareSection className='md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>Contributors</span>
            <span>{contributors?.length}</span>
          </h2>
          <SoftwareContributorsList
            contributors={contributors}
            onEdit={onEditContributor}
            onDelete={onDeleteContributor}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findContributor.title}
            subtitle={config.findContributor.subtitle}
          />
          <FindContributor
            onAdd={onAddContributor}
            onCreate={onCreateNewContributor}
          />
        </section>
      </EditSoftwareSection>
      <EditContributorModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        contributor={modal.edit.contributor}
        onCancel={() => {
          setModal({
            edit:{open:false},
            delete:{open:false}
          })
        }}
        onSubmit={onSubmitContributor}
      />
      <ConfirmDeleteModal
        open={modal.delete.open}
        title="Remove contributor"
        body={
          <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? 'No name'}</strong>?</p>
        }
        onCancel={() => {
          setModal({
            edit:{open:false},
            delete:{open:false}
          })
        }}
        onDelete={()=>deleteContributor(modal.delete.pos)}
      />
    </>
  )
}
