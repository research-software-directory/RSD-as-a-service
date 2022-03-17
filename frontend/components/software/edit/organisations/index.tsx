import {useContext, useState} from 'react'

import {Session} from '../../../../auth'
import useSnackbar from '../../../snackbar/useSnackbar'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'
import {
  EditOrganisation,
  SearchOrganisation
} from '../../../../types/Organisation'
import {sortOnStrProp} from '../../../../utils/sortFn'
import {uploadBase64Logo} from '../../../../utils/uploadImage'
import {
  addOrganisation,
  addOrganisationToSoftware,
  deleteOrganisationFromSoftware,
  searchToEditOrganisation,
  updateOrganisation
} from '../../../../utils/editOrganisation'
import useParticipatingOrganisations from '../../../../utils/useParticipatingOrganisations'
import {organisationInformation as config} from '../editSoftwareConfig'
import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext from '../editSoftwareContext'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import EditSectionTitle from '../EditSectionTitle'
import FindOrganisation from './FindOrganisation'
import EditOrganisationModal from './EditOrganisationModal'
import OrganisationsList from './OrganisationsList'

type EditOrganisationModal = ModalProps & {
  organisation?: EditOrganisation
}

export default function SoftwareOganisations({session}:{session:Session}) {
  const {showErrorMessage} = useSnackbar()
  const {pageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const {loading, organisations, setOrganisations} = useParticipatingOrganisations({
    software: software?.id,
    token: session?.token,
    account: session.user?.account
  })
  const [modal, setModal] = useState<ModalStates<EditOrganisationModal>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    }
  })

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  async function onAddOrganisation(item: SearchOrganisation) {
    // add default values
    const addOrganisation: EditOrganisation = searchToEditOrganisation({
      item,
      account: session?.user?.account,
      position: organisations.length + 1
    })
    if (item.source === 'ROR') {
      // show edit modal
      setModal({
        edit: {
          open: true,
          organisation: addOrganisation,
        },
        delete: {
          open:false
        }
      })
    } else if (item.source === 'RSD') {
      // we add organisation directly
      const resp = await addOrganisationToSoftware({
        software: software?.id ?? '',
        organisation: item.id ?? '',
        account: session.user?.account ?? '',
        token: session.token
      })
      if (resp.status === 200) {
        addOrganisationToList(addOrganisation)
      } else {
        showErrorMessage(resp.message)
      }
    }
  }

  function onCreateOrganisation(name:string) {
    // create new organisation object
    const newOrganisation:EditOrganisation = {
      id: null,
      name,
      is_tenant: false,
      position: organisations.length + 1,
      logo_b64: null,
      logo_mime_type: null,
      website: null,
      source: 'MANUAL' as 'MANUAL',
      primary_maintainer: session?.user?.account,
      canEdit: true
    }
    // show modal
    setModal({
      edit: {
        open: true,
        organisation: newOrganisation,
      },
      delete: {
        open:false
      }
    })
  }

  function onEdit(pos: number) {
    const organisation = organisations[pos]
    if (organisation) {
      setModal({
        edit: {
          open: true,
          organisation,
          pos
        },
        delete: {
          open:false
        }
      })
    }
  }

  function onDelete(pos: number) {
    const organisation = organisations[pos]
    if (organisation) {
      const displayName = organisation.name
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
  }

  async function deleteOrganisation(pos: number | undefined) {
    closeModals()
    // abort if no pos in array
    if (typeof pos == 'undefined') return
    // get organisation
    const organisation = organisations[pos]
    // if it has id
    if (organisation?.id) {
      const resp = await deleteOrganisationFromSoftware({
        software: software?.id,
        organisation: organisation.id,
        token: session.token
      })
      if (resp.status === 200) {
        deleteOrganisationFromList(pos)
      } else {
        showErrorMessage(resp.message)
      }
    }
  }

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number }) {
    try {
      closeModals()
      // upload new image
      if (data?.logo_b64 && data?.logo_mime_type) {
        const resp = await uploadBase64Logo({
          b64image: data.logo_b64,
          mime_type: data.logo_mime_type,
          token: session.token
        })
        if (resp.status !== 201) {
          throw new Error(`Failed to upload image. ${resp.message}`)
        }
        // image url is returned in message
        data.logo_id = resp.message
      }
      if (typeof pos == 'undefined') {
        const resp = await addOrganisation({
          item: data,
          software: software?.id ?? '',
          account: session?.user?.account ?? '',
          token: session?.token
        })
        if (resp.status === 200) {
          // update local list
          addOrganisationToList(data)
        } else {
          showErrorMessage(resp.message)
        }
      } else {
        const resp = await updateOrganisation({
          item: data,
          token: session?.token
        })
        if (resp.status === 200) {
          // update local list
          addOrganisationToList(data)
        } else {
          showErrorMessage(resp.message)
        }
      }
    } catch (e:any) {
      showErrorMessage(e.message)
    }
  }

  return (
    <section className="flex-1">
      <EditSoftwareSection className="md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]">
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{config.title}</span>
            <span>{organisations?.length}</span>
          </h2>
          <OrganisationsList
            organisations={organisations}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findOrganisation.title}
            subtitle={config.findOrganisation.subtitle}
          />
          <FindOrganisation
            onAdd={onAddOrganisation}
            onCreate={onCreateOrganisation}
          />
        </section>
      </EditSoftwareSection>
      <EditOrganisationModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        organisation={modal.edit.organisation}
        onCancel={closeModals}
        onSubmit={saveOrganisation}
      />
      <ConfirmDeleteModal
        title="Remove organisation"
        open={modal.delete.open}
        body={
          <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? ''}</strong>?</p>
        }
        onCancel={closeModals}
        onDelete={()=>deleteOrganisation(modal.delete.pos)}
      />
    </section>
  )

  function closeModals() {
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
  }

  function addOrganisationToList(newItem: EditOrganisation) {
    const newList = [
      ...organisations,
      newItem
    ].sort((a, b) => sortOnStrProp(a, b, 'name'))
    setOrganisations(newList)
  }

  function deleteOrganisationFromList(pos: number) {
    const newList = [
      ...organisations.slice(0, pos),
      ...organisations.slice(pos+1)
    ]
    setOrganisations(newList)
  }
}
