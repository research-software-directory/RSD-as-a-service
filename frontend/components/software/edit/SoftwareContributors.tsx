import {useContext,useEffect,useState} from 'react'

import {app} from '../../../config/app'
import snackbarContext from '../../snackbar/PageSnackbarContext'
import ContentLoader from '../../layout/ContentLoader'
import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext, {EditSoftwareActionType} from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'
import {
  addContributorToDb, deleteContributorsById,
  getContributorsForSoftware, updateContributorInDb
} from '../../../utils/editContributors'
import {Contributor, ContributorProps} from '../../../types/Contributor'
import useOnUnsaveChange from '../../../utils/useOnUnsavedChange'
import SoftwareContributorsList from './SoftwareContributorsList'
import EditContributorModal from './EditContributorModal'
import ConfirmDeleteModal from '../../layout/ConfirmDeleteModal'
import {getDisplayName} from '../../../utils/getDisplayName'
import FindContributor, {Name} from './FindContributor'
import {sortOnStrProp} from '../../../utils/sortFn'
import {getPropsFromObject} from '../../../utils/getPropsFromObject'
import {contributorInformation as config} from './editSoftwareConfig'

type ModalProps = {
  open: boolean
  pos?: number
}

type EditModalProps = ModalProps & {
  contributor?: Contributor
}

type DeleteModalProps = ModalProps & {
  displayName?: string
}

type ModalStates = {
  edit: EditModalProps,
  delete: DeleteModalProps
}

export default function SoftwareContributors({slug, token}: { slug: string, token: string }) {
  const {options: snackbarOptions, setSnackbar} = useContext(snackbarContext)
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [loading, setLoading] = useState(true)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [modal, setModal] = useState<ModalStates>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })
  // we use react-hook-form and pageState to enable/disable Save button in the header
  // when user clicks on the Save button it will trigger onSubmit event in this component
  // const {handleSubmit} = useForm<{changed:boolean}>({
  //   mode: 'onChange'
  // })
  // extract from (shared) pageState
  const {isDirty,isValid} = pageState
  // // watch for unsaved changes
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })
  // console.group('SoftwareContributors')
  // console.log('loading...', loading)
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('contributors...', contributors)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    const getContributors = async (software:string,token:string) => {
      const resp = await getContributorsForSoftware({
        software,
        token,
        frontend:true
      })
      if (abort) return
      // debugger
      setContributors(resp ?? [])
      // setReferenceList(resp ?? [])
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
    // show modal and pass the data
    setModal({
      edit:{
        open: true,
        pos: undefined,
        contributor: newContributor
      },
      delete: {
        open: false,
        pos: undefined
      }
    })
  }

  function onEditContributor(pos:number) {
    // select contributor
    const contributor = contributors[pos]
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
        setSnackbar({
          ...snackbarOptions,
          open: true,
          severity: 'success',
          message: `Updated ${getDisplayName(data)}`,
        })
      } else {
        setSnackbar({
          ...snackbarOptions,
          open: true,
          severity: 'error',
          message: `Failed to update ${getDisplayName(data)}. Error: ${resp.message}`,
        })
      }
    } else {
      // this is completely new contributor we need to add to DB
      onAddContributor(data)
    }
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
    // add contributor to database
    const resp = await addContributorToDb({contributor, token})
    if (resp.status === 201) {
      // id of created record is provided in return message
      contributor.id = resp.message
      // update contributor list
      updateContributorList({data:contributor})
    } else {
      setSnackbar({
        ...snackbarOptions,
        open: true,
        severity: 'error',
        message: `Failed to add ${getDisplayName(contributor)}. Error: ${resp.message}`,
      })
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
          setSnackbar({
            ...snackbarOptions,
            open: true,
            severity: 'success',
            message: `Removed ${getDisplayName(contributor)} from ${pageState.software.brand_name}`,
            duration: 5000
          })
          removeFromContributorList(pos)
        } else {
          setSnackbar({
            ...snackbarOptions,
            open: true,
            severity: 'error',
            message: `Failed to remove ${getDisplayName(contributor)}. Error: ${resp.message}`,
          })
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
      <EditSoftwareSection className='md:flex md:flex-col-reverse md:justify-end xl:pl-8 xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <section className="py-6">
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
        <section className="py-6">
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
        title="Remove contributor"
        open={modal.delete.open}
        displayName={modal.delete.displayName ?? 'No name'}
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
