// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import OrganisationsList from '~/components/software/edit/organisations/OrganisationsList'
import useProjectContext from '../useProjectContext'
import useParticipatingOrganisations from './useParticipatingOrganisations'
import {cfgOrganisations as config} from './config'
import FindOrganisation from '~/components/software/edit/organisations/FindOrganisation'
import EditOrganisationModal from '~/components/software/edit/organisations/EditOrganisationModal'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {EditOrganisationModalProps} from '~/components/software/edit/organisations'
import {ModalStates} from '~/components/software/edit/editSoftwareTypes'
import {EditOrganisation, SearchOrganisation} from '~/types/Organisation'
import {sortOnStrProp} from '~/utils/sortFn'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteOrganisationLogo, newOrganisationProps, saveExistingOrganisation, searchToEditOrganisation} from '~/utils/editOrganisation'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {addOrganisationToProject, createOrganisationAndAddToProject, deleteOrganisationFromProject} from '~/utils/editProject'

export default function ProjectOrganisations({session}: { session: Session }) {
  const {showErrorMessage} = useSnackbar()
  const {setLoading, project} = useProjectContext()
  const {loading, organisations, setOrganisations} = useParticipatingOrganisations({
    project: project.id,
    token: session?.token,
    account: session.user?.account
  })
  const [modal, setModal] = useState<ModalStates<EditOrganisationModalProps>>({
    edit: {
      open: false,
    },
    delete: {
      open: false
    }
  })
  if (loading) {
    return (
      <ContentLoader />
    )
  }

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
      const resp = await addOrganisationToProject({
        project: project.id ?? '',
        organisation: item.id ?? '',
        role: 'participating',
        session
      })
      if (resp.status === 200) {
        // update status received in message
        addOrganisation.status = resp.message
        // assume logo is uploaded?!?
        addOrganisation.logo_id = item.id
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
      const resp = await deleteOrganisationFromProject({
        project: project.id,
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
      if (typeof pos != 'undefined' && data.id) {
        // update existing organisation
        const resp = await saveExistingOrganisation({
          item: data,
          token: session?.token,
          pos,
          setState: updateOrganisationInList
        })
        if (resp.status !== 200) {
          showErrorMessage(resp.message)
        }
      } else {
        // create slug for new organisation based on name
        data.slug = getSlugFromString(data.name)
        // create new organisation and add it
        const resp = await createOrganisationAndAddToProject({
          project: project.id,
          item: data,
          session,
          setState: addOrganisationToList
        })
        if (resp.status !== 200) {
          showErrorMessage(resp.message)
        }
      }
    } catch (e:any) {
      showErrorMessage(e.message)
    }
  }

  async function onDeleteOrganisationLogo(logo_id:string) {
    const resp = await deleteOrganisationLogo({
      id: logo_id,
      token: session.token
    })
    if (resp.status !== 200) {
      showErrorMessage(resp.message)
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
    ].sort((a, b) => sortOnStrProp(a, b, 'name'))
    setOrganisations(newList)
  }

  function updateOrganisationInList(newItem: EditOrganisation,pos:number) {
    const newList = [
      ...organisations.slice(0, pos),
      ...organisations.slice(pos+1),
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

  return (
    <>
      <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]">
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
      </EditSection>
      <EditOrganisationModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        organisation={modal.edit.organisation}
        onCancel={closeModals}
        onSubmit={saveOrganisation}
        onDeleteLogo={onDeleteOrganisationLogo}
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
    </>
  )
}
