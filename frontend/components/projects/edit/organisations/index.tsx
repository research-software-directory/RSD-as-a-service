// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {colForUpdate, EditOrganisation, SearchOrganisation} from '~/types/Organisation'
import {
  newOrganisationProps,
  searchToEditOrganisation, updateOrganisation
} from '~/components/organisation/apiEditOrganisation'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {
  addOrganisationToProject, createOrganisationAndAddToProject,
  deleteOrganisationFromProject, patchOrganisationPositions
} from '~/components/projects/edit/apiEditProject'
import SortableOrganisationsList from '~/components/software/edit/organisations/SortableOrganisationsList'
import {upsertImage} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditOrganisationModalProps, OrganisationModalStates} from '~/components/software/edit/organisations'
import FindOrganisation from '~/components/software/edit/organisations/FindOrganisation'
import EditOrganisationModal from '~/components/software/edit/organisations/EditOrganisationModal'
import useProjectContext from '../context/useProjectContext'
import useParticipatingOrganisations from './useParticipatingOrganisations'
import {cfgOrganisations as config} from './config'
import ProjectCategoriesDialog from './ProjectCategoriesDialog'
import {removeOrganisationCategoriesFromProject} from './apiProjectOrganisations'

export default function ProjectOrganisations() {
  const {token,user} = useSession()
  const {showErrorMessage,showInfoMessage} = useSnackbar()
  const {project} = useProjectContext()
  const {loading, organisations, setOrganisations} = useParticipatingOrganisations({
    project: project.id,
    token: token,
    account: user?.account
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

  // console.group('ProjectOrganisations')
  // console.log('organisations...', organisations)
  // console.groupEnd()

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
          open: false
        }
      })
    } else if (item.source === 'RSD' && addOrganisation.id) {
      // we add organisation directly
      const resp = await addOrganisationToProject({
        project: project.id,
        organisation: addOrganisation.id,
        role: 'participating',
        position: addOrganisation.position,
        token
      })
      if (resp.status === 200) {
        // update status received in message
        addOrganisation.status = resp.message
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
      // new organisations without primary_maintainer
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
        open: false
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
          open: false
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
          open: false
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
      // remove categories from project - do not wait for result
      removeOrganisationCategoriesFromProject(project.id,organisation.id,token)
      // remove organisation from project
      const resp = await deleteOrganisationFromProject({
        project: project.id,
        organisation: organisation.id,
        role: organisation.role ?? 'participating',
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
      // UPLOAD logo
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
      // SAVE organisation
      if (typeof pos != 'undefined' && data.id) {
        // extract data for update
        const organisation = getPropsFromObject(data,colForUpdate)
        // update existing organisation
        const resp = await updateOrganisation({
          organisation,
          token
        })
        if (resp.status === 200) {
          updateOrganisationInList(data,pos)
          closeModals()
        } else {
          showErrorMessage(resp.message)
        }
      } else {
        // create slug for new organisation based on name
        data.slug = getSlugFromString(data.name)
        // create new organisation and add it
        const {status,message} = await createOrganisationAndAddToProject({
          project: project.id,
          item: data,
          token
        })
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
        open: false
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
    const newList = organisations.map((item,i) => {
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
      // first update ui
      setOrganisations(newList)
      // console.log('sorted organisations...', organisations)
      const resp = await patchOrganisationPositions({
        project: project.id,
        organisations:newList,
        token
      })
      if (resp.status !== 200) {
        setOrganisations(organisations)
        showErrorMessage(`Failed to update organisation positions. ${resp.message}`)
      }
    } else {
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

  if (loading) {
    return (
      <ContentLoader />
    )
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
      {modal.categories.open && modal.categories.organisation ?
        <ProjectCategoriesDialog
          projectId={project.id}
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
