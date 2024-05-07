// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {Contributor, SaveContributor} from '~/types/Contributor'
import {
  deleteContributorsById,
  patchContributorPositions,
} from '~/utils/editContributors'
import {getDisplayName} from '~/utils/getDisplayName'
import EditContributorModal from './EditContributorModal'
import FindContributor from './FindContributor'
import EditSection from '../../../layout/EditSection'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {contributorInformation as config} from '../editSoftwareConfig'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import GetContributorsFromDoi from './GetContributorsFromDoi'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareContributors from './useSoftwareContributors'
import SortableContributorsList from './SortableContributorsList'
import {deleteImage} from '~/utils/editImage'
import ContributorPrivacyHint from '~/components/layout/ContributorPrivacyHint'

type EditContributorModal = ModalProps & {
  contributor?: Contributor
}

export default function SoftwareContributors() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading,contributors,setContributors} = useSoftwareContributors()
  const [modal, setModal] = useState<ModalStates<EditContributorModal>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })

  // console.group('SoftwareContributors')
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('contributors...', contributors)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function hideModals() {
    // hide modals
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
  }

  function updateContributorList({data, pos}: { data: Contributor, pos?: number }) {
    if (typeof pos === 'number') {
      // REPLACE existing item and sort
      const list = contributors.map((item, i) => {
        // replace item at pos
        if (i === pos) return data
        return item
      })
      updateContactPeople(data, list)
      // pass new list with addition contributor
      setContributors(list)
    } else {
      // ADD item and sort
      const list = [
        ...contributors,
        data
      ]
      updateContactPeople(data, list)
      setContributors(list)
    }
  }

  async function updateContactPeople(data: Contributor, list: Contributor[]) {
    if (!data.is_contact_person) return

    list.forEach(person => {
      if (!person.is_contact_person || person === data) return
      fetch(`/api/v1/contributor?id=eq.${person.id}`, {
        method: 'PATCH',
        body: JSON.stringify({is_contact_person: false}),
        headers: {'content-type': 'application/json', Authorization: 'Bearer ' + token}
      })
      person.is_contact_person = false
    })
  }

  function loadContributorIntoModal(contributor: Contributor,pos?:number) {
    if (contributor && software?.id) {
      // load software.id
      contributor.software = software?.id
      if (typeof pos==='undefined') {
        // this is new member and we need to add position
        contributor.position = contributors.length + 1
      }
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          pos,
          contributor
        },
        delete: {
          open: false
        }
      })
    }
  }

  function onEditContributor(pos:number) {
    // select contributor
    const contributor = contributors[pos]
    loadContributorIntoModal(contributor,pos)
  }

  function onSubmitContributor({contributor, pos}:{contributor:SaveContributor,pos?: number}) {
    // update contributors list
    updateContributorList({data: contributor,pos})
    hideModals()
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
    hideModals()
    // abort if not specified
    if (typeof pos == 'number') {
      const contributor = contributors[pos]
      // existing contributor
      if (contributor.id) {
        // remove from database
        const ids = [contributor.id]
        const resp = await deleteContributorsById({ids, token})
        if (resp.status === 200) {
          removeFromContributorList(pos)
        } else {
          showErrorMessage(`Failed to remove ${getDisplayName(contributor)}. Error: ${resp.message}`)
        }
        // try to remove member avatar
        // without waiting for result
        if (contributor.avatar_id) {
          const del = await deleteImage({
            id: contributor.avatar_id,
            token
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
    ].map((item, pos) => {
      // renumber positions
      item.position = pos + 1
      return item
    })
    sortedContributors(list)
  }

  async function sortedContributors(newList: Contributor[]) {
    if (newList.length > 0) {
      // update ui first
      setContributors(newList)
      // update db
      const resp = await patchContributorPositions({
        contributors:newList,
        token
      })
      if (resp.status !== 200) {
        // revert back
        setContributors(contributors)
        // show error message
        showErrorMessage(`Failed to update contributor positions. ${resp.message}`)
      }
    } else {
      setContributors([])
    }
  }

  return (
    <>
      <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>Contributors</span>
            <span>{contributors?.length}</span>
          </h2>
          <SortableContributorsList
            contributors={contributors}
            onEdit={onEditContributor}
            onDelete={onDeleteContributor}
            onSorted={sortedContributors}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findContributor.title}
            subtitle={config.findContributor.subtitle}
          />
          <FindContributor
            software={software.id}
            position={contributors.length + 1}
            onEdit={loadContributorIntoModal}
            onSubmit={onSubmitContributor}
          />
          <ContributorPrivacyHint />
          <div className="pt-8 pb-0">
            <EditSectionTitle
              title={config.importContributors.title}
              subtitle={config.importContributors.subtitle}
              infoLink={config.importContributors.infoLink}
            />
            <GetContributorsFromDoi
              contributors={contributors}
              onSetContributors={setContributors}
            />
          </div>
        </section>
      </EditSection>
      {modal.edit.open &&
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
      }
      {modal.delete.open &&
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
      }
    </>
  )
}
