// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {
  colForUpdate,
  EditOrganisation,
  SearchOrganisation,
  SoftwareForOrganisation
} from '~/types/Organisation'
import {
  newOrganisationProps,
  searchToEditOrganisation,
  updateOrganisation,
} from '~/components/organisation/apiEditOrganisation'
import {upsertImage} from '~/utils/editImage'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import EditSection from '~/components/layout/EditSection'
import {organisationInformation as config} from '../editSoftwareConfig'
import useSoftwareContext from '../context/useSoftwareContext'
import useParticipatingOrganisations from './useParticipatingOrganisations'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import FindOrganisation from './FindOrganisation'
import EditOrganisationModal from './EditOrganisationModal'
import SortableOrganisationsList from './SortableOrganisationsList'
import {
  addOrganisationToSoftware, createOrganisationAndAddToSoftware,
  deleteOrganisationFromSoftware, patchOrganisationPositions
} from './organisationForSoftware'
import SoftwareCategoriesDialog from './SoftwareCategoriesDialog'
import {removeOrganisationCategoriesFromSoftware} from './apiSoftwareOrganisations'

export type OrganisationModalStates<T> = ModalStates<T> & {
  categories: T
}

export type EditOrganisationModalProps = ModalProps & {
  organisation?: EditOrganisation
  // edit categories flag
  edit?: boolean
}

export default function SoftwareOrganisations() {
  const {token,user} = useSession()
  const {showInfoMessage,showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading, organisations, setOrganisations} = useParticipatingOrganisations({
    software: software?.id ?? '',
    account: user?.account ?? '',
    token
  })
  const [modal, setModal] = useState<OrganisationModalStates<EditOrganisationModalProps>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    },
    categories:{
      open: false
    }
  })

  // console.group('SoftwareOrganisations')
  // console.log('loading...', loading)
  // console.log('organisations...', organisations)
  // console.log('modal...', modal)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  async function onAddOrganisation(item: SearchOrganisation) {
    // check if present by ror_id
    const found = organisations.find(org => org.ror_id === item.ror_id)
    if (item.ror_id && found) {
      showInfoMessage(`${item.name} is already in the collection (based on ROR ID).`)
      return
    }
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
        },
        categories:{
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
        // show categories modal
        setModal({
          edit: {
            open: false,
          },
          delete: {
            open:false
          },
          categories:{
            open: true,
            organisation: addOrganisation,
            edit: false
          }
        })
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
      },
      categories:{
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
        },
        categories:{
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
        },
        categories:{
          open:false
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
    if (organisation?.id && software?.id) {
      // remove categories from software - do not wait for result
      removeOrganisationCategoriesFromSoftware(software?.id, organisation.id, token)
      // remove organisation from software
      const resp = await deleteOrganisationFromSoftware({
        software: software?.id,
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

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number}) {
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
        const organisation = getPropsFromObject(data,colForUpdate)
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
      },
      categories:{
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

  async function sortedOrganisations(newList: EditOrganisation[]) {
    if (newList.length > 0) {
      // update ui first
      setOrganisations(newList)
      // update db
      const resp = await patchOrganisationPositions({
        software: software.id ?? '',
        organisations:newList,
        token
      })
      if (resp.status !== 200) {
        // revert back
        setOrganisations(organisations)
        // show error
        showErrorMessage(`Failed to update organisation positions. ${resp.message}`)
      }
    } else {
      // reset list
      setOrganisations([])
    }
  }

  function onCategoryEdit(pos:number){
    const organisation = organisations[pos]
    if (organisation){
      setModal({
        edit: {
          open:false
        },
        delete: {
          open:false
        },
        categories:{
          open:true,
          organisation,
          // editing categories
          edit: true
        }
      })
    }
  }

  return (
    <>
      <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
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
            onCategory={onCategoryEdit}
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
      </EditSection>
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
      {modal.categories.open===true && modal.categories.organisation ?
        <SoftwareCategoriesDialog
          softwareId={software.id}
          organisation={modal.categories.organisation}
          edit={modal.categories.edit ?? false}
          onCancel={closeModals}
          onComplete={closeModals}
        />
        : null
      }
    </>
  )
}
