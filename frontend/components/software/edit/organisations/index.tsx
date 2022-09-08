// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '../../../../auth'
import useSnackbar from '../../../snackbar/useSnackbar'
import ContentLoader from '../../../layout/ContentLoader'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'
import {
  EditOrganisation,
  SearchOrganisation,
  SoftwareForOrganisation
} from '../../../../types/Organisation'
import {sortOnStrProp} from '../../../../utils/sortFn'
import {
  addOrganisationToSoftware,
  deleteOrganisationFromSoftware,
  deleteOrganisationLogo,
  newOrganisationProps,
  saveExistingOrganisation,
  saveNewOrganisationForSoftware,
  searchToEditOrganisation,
} from '../../../../utils/editOrganisation'
import useParticipatingOrganisations from './useParticipatingOrganisations'
import {organisationInformation as config} from '../editSoftwareConfig'
import EditSoftwareSection from '../../../layout/EditSection'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import FindOrganisation from './FindOrganisation'
import EditOrganisationModal from './EditOrganisationModal'
import OrganisationsList from './OrganisationsList'
import {getSlugFromString} from '../../../../utils/getSlugFromString'
import useSoftwareContext from '../useSoftwareContext'

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
        organisation: item.id ?? '',
        account: user?.account ?? '',
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

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number }) {
    try {
      closeModals()
      if (typeof pos != 'undefined' && data.id) {
        // update existing organisation
        const resp = await saveExistingOrganisation({
          item: data,
          token,
          pos,
          setState: updateOrganisationInList
        })
        if (resp.status !== 200) {
          showErrorMessage(resp.message)
        }
      } else {
        // create slug for new organisation based on name
        data.slug = getSlugFromString(data.name)
        // create new organisation
        const resp = await saveNewOrganisationForSoftware({
          item: data,
          software: software?.id ?? '',
          account: user?.account ?? '',
          token,
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
      token
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
      <EditSoftwareSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]">
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
