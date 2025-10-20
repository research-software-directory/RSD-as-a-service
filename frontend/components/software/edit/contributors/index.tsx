// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {PersonProps, Person} from '~/types/Contributor'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {getDisplayName} from '~/utils/getDisplayName'
import useRsdSettings from '~/config/useRsdSettings'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContributorPrivacyHint from '~/components/layout/ContributorPrivacyHint'
import AggregatedPersonModal, {FormPerson} from '~/components/person/AggregatedPersonModal'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import FindPerson from '~/components/person/FindPerson'
import {personAlreadyPresent} from '~/components/person/searchForPerson'
import {contributorInformation as config} from '../editSoftwareConfig'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import useSoftwareContext from '../context/useSoftwareContext'
import GetContributorsFromDoi from './GetContributorsFromDoi'
import useSoftwareContributors from './useSoftwareContributors'
import SortableContributorsList from './SortableContributorsList'

type EditContributorModal = ModalProps & {
  contributor?: Person
}

export default function EditSoftwareContributors() {
  const {host} = useRsdSettings()
  const {software} = useSoftwareContext()
  const {showInfoMessage} = useSnackbar()
  const {
    loading,contributors,addContributor,
    updateContributor,deleteContributor,
    sortedContributors, setContributors
  } = useSoftwareContributors()
  const [modal, setModal] = useState<ModalStates<EditContributorModal>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })

  // console.group('SoftwareContributors')
  // console.log('contributors...', contributors)
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('orcid...', orcid)
  // console.log('options...', options)
  // console.groupEnd()

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

  function onCreateContributor(person: Person) {
    // debugger
    if (person && software?.id) {
      // construct contributor
      const contributor = {
        ...person,
        position: contributors.length + 1
      }
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          contributor
        },
        delete: {
          open: false
        }
      })
    }
  }

  function onFoundPerson(person:AggregatedPerson){
    // debugger
    if (person && software?.id) {
      // check if this person is already in the list
      if (personAlreadyPresent(contributors,person)===true){
        showInfoMessage(`${person.display_name} already in the list, based on ORCID or account id.`)
        return true
      }
      // extract person props as much as possible (use null if not found)
      const contributor:Person = getPropsFromObject(person, PersonProps, true)
      // use first avatar (if exists)
      contributor.avatar_id = person.avatar_options[0] ?? null
      // use affiliation (if exists)
      contributor.affiliation = person.affiliation_options[0] ?? null
      // use role (if one)
      if (person.role_options.length===1){
        contributor.role = person.role_options[0]
      }
      // use email (if one)
      if (person.email_options.length===1){
        contributor.email_address = person.email_options[0]
      }
      // flag contact person to false
      contributor.is_contact_person = false
      // add position
      contributor.position = contributors.length + 1
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          contributor
        },
        delete: {
          open: false
        }
      })
    }
  }

  async function onEditContributor(pos:number) {
    // select contributor
    const contributor:Person = getPropsFromObject(contributors[pos],PersonProps,true)
    // show modal and pass data
    setModal({
      edit: {
        pos,
        open: true,
        contributor
      },
      delete: {
        open: false
      }
    })
  }

  function onSubmitContributor({person,pos}:{person:FormPerson,pos?:number}) {
    hideModals()
    // debugger
    if (typeof pos == 'undefined'){
      addContributor(person)
    } else {
      updateContributor(person)
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

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  return (
    <>
      <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]'>
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
            subtitle={config.findContributor.subtitle(host?.orcid_search)}
          />
          <FindPerson
            onCreate={onCreateContributor}
            onAdd={onFoundPerson}
            config={{
              minLength: config.findContributor.validation.minLength,
              label: config.findContributor.label,
              help: config.findContributor.help,
              // clear options after selection
              reset: true,
              // include ORCID api?
              include_orcid: host?.orcid_search
            }}
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
      {modal.edit.open && modal.edit.contributor ?
        <AggregatedPersonModal
          title="Contributor"
          person={modal.edit.contributor}
          onCancel={hideModals}
          onSubmit={(person)=>{
            onSubmitContributor({person, pos: modal.edit.pos})
          }}
        />
        : null
      }
      {modal.delete.open ?
        <ConfirmDeleteModal
          open={modal.delete.open}
          title="Remove contributor"
          body={
            <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? 'No name'}</strong>?</p>
          }
          onCancel={hideModals}
          onDelete={()=>{
            if (typeof modal.delete.pos != 'undefined'){
              deleteContributor(contributors[modal.delete.pos])
            }
            hideModals()
          }}
        />
        : null
      }
    </>
  )
}
