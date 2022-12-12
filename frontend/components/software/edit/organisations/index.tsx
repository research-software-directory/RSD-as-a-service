// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '../../../../auth'
import useSnackbar from '../../../snackbar/useSnackbar'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'
import {
  columsForUpdate,
  EditOrganisation,
  SearchOrganisation,
  SoftwareForOrganisation
} from '../../../../types/Organisation'
import {
  newOrganisationProps,
  searchToEditOrganisation,
  updateOrganisation,
} from '../../../../utils/editOrganisation'
import useParticipatingOrganisations from './useParticipatingOrganisations'
import {organisationInformation as config} from '../editSoftwareConfig'
import EditSoftwareSection from '../../../layout/EditSection'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import FindOrganisation from './FindOrganisation'
import EditOrganisationModal from './EditOrganisationModal'
import {getSlugFromString} from '../../../../utils/getSlugFromString'
import useSoftwareContext from '../useSoftwareContext'
import SortableOrganisationsList from './SortableOrganisationsList'
import {
  addOrganisationToSoftware, createOrganisationAndAddToSoftware,
  deleteOrganisationFromSoftware, patchOrganisationPositions
} from './organisationForSoftware'
import {deleteImage, upsertImage} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'

export type EditOrganisationModalProps = ModalProps & {
  organisation?: EditOrganisation
}

export default function SoftwareOganisations() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading, organisations, setOrganisations} = useParticipatingOrganisations({
    software: software?.id ?? '',
    account: user?.account ?? '',
    token
  })
  const [modal, setModal] = useState<ModalStates<EditOrganisationModalProps>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    }
  })

  // console.group('SoftwareOganisations')
  // console.log('loading...', loading)
  // console.log('organisations...', organisations)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  async function onAddOrganisation(item: SearchOrganisation) {
    // add default values
    const addOrganisation: EditOrganisation = searchToEditOrganisation({
      item,
      account: user?.account,
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
        organisation: addOrganisation.id ?? '',
        position: addOrganisation.position,
        token
      })
      if (resp.status === 200) {
        // update status received in message
        addOrganisation.status = resp.message as SoftwareForOrganisation['status']
        addOrganisationToList(addOrganisation)
      } else {
        showErrorMessage(resp.message)
      }
    }
  }

  function onCreateOrganisation(name:string) {
    // create new organisation object
    const newOrganisation: EditOrganisation = newOrganisationProps({
      name,
      position: organisations.length + 1,
      // new organisation without primary maintainer
      primary_maintainer: null,
    })
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
        software: software?.id ?? undefined,
        organisation: organisation.id,
        token
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
      // UPLOAD LOGO
      if (data.logo_b64 && data.logo_mime_type) {
        // split base64 to use only encoded content
        const b64data = data.logo_b64.split(',')[1]
        const upload = await upsertImage({
          data: b64data,
          mime_type: data.logo_mime_type,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update data values
          data.logo_id = upload.message
          // remove image strings after upload
          data.logo_b64 = null
          data.logo_mime_type = null
        } else {
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return
        }
      }
      if (typeof pos !== 'undefined' && data.id) {
        // extract data for update
        const organisation = getPropsFromObject(data,columsForUpdate)
        // update existing organisation
        const resp = await updateOrganisation({
          organisation,
          token
        })
        // debugger
        if (resp.status === 200) {
          updateOrganisationInList(data,pos)
          closeModals()
        } else {
          showErrorMessage(resp.message)
        }
      } else {
        // create slug for new organisation based on name
        data.slug = getSlugFromString(data.name)
        // create new organisation
        const {status,message} = await createOrganisationAndAddToSoftware({
          item: data,
          software: software?.id ?? '',
          token
        })
        // debugger
        if (status === 200) {
          addOrganisationToList(message)
          closeModals()
        } else {
          showErrorMessage(message)
        }
      }
    } catch (e:any) {
      showErrorMessage(e.message)
    }
  }

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
    ]
    setOrganisations(newList)
  }

  function updateOrganisationInList(newItem: EditOrganisation,pos:number) {
    const newList = organisations.map((item, i) => {
      if (i === pos) return newItem
      return item
    })
    setOrganisations(newList)
  }

  async function deleteOrganisationFromList(pos: number) {
    const newList = [
      ...organisations.slice(0, pos),
      ...organisations.slice(pos+1)
    ].map((item, pos) => {
      // renumber
      item.position = pos + 1
      return item
    })
    // renumber remaining organisations
    await sortedOrganisations(newList)
  }

  async function sortedOrganisations(organisations: EditOrganisation[]) {
    if (organisations.length > 0) {
      const resp = await patchOrganisationPositions({
        software: software.id ?? '',
        organisations,
        token
      })
      if (resp.status === 200) {
        setOrganisations(organisations)
      } else {
        showErrorMessage(`Failed to update organisation positions. ${resp.message}`)
      }
    } else {
      setOrganisations(organisations)
    }
  }

  return (
    <>
      <EditSoftwareSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]">
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{config.title}</span>
            <span>{organisations?.length}</span>
          </h2>
          <SortableOrganisationsList
            organisations={organisations}
            onEdit={onEdit}
            onDelete={onDelete}
            onSorted={sortedOrganisations}
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
      {modal.edit.open &&
        <EditOrganisationModal
          open={modal.edit.open}
          pos={modal.edit.pos}
          organisation={modal.edit.organisation}
          onCancel={closeModals}
          onSubmit={saveOrganisation}
        />
      }
      {modal.delete.open &&
        <ConfirmDeleteModal
          title="Remove organisation"
          open={modal.delete.open}
          body={
            <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? ''}</strong>?</p>
          }
          onCancel={closeModals}
          onDelete={()=>deleteOrganisation(modal.delete.pos)}
        />
      }
    </>
  )
}
