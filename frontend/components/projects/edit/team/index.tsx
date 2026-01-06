// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {getDisplayName} from '~/utils/getDisplayName'
import {Person, PersonProps} from '~/types/Contributor'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import useRsdSettings from '~/config/useRsdSettings'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContributorPrivacyHint from '~/components/layout/ContributorPrivacyHint'
import AggregatedPersonModal, {FormPerson} from '~/components/person/AggregatedPersonModal'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import FindPerson from '~/components/person/FindPerson'
import {personAlreadyPresent} from '~/components/person/searchForPerson'
import useProjectContext from '../context/useProjectContext'
import {cfgTeamMembers} from './config'
import {ModalProps, ModalStates} from './apiTeamMembers'
import useTeamMembers from './useTeamMembers'
import SortableTeamMemberList from './SortableTeamMemberList'

type EditMemberModal = ModalProps & {
  member?: Person
}

export default function ProjectTeam() {
  const {host} = useRsdSettings()
  const {project} = useProjectContext()
  const {showInfoMessage} = useSnackbar()
  const {
    loading,members,addMember,
    updateMember,sortedMembers,deleteMember
  } = useTeamMembers()
  const [modal, setModal] = useState<ModalStates<EditMemberModal>>({
    edit: {
      open: false
    },
    delete: {
      open: false,
      displayName: null
    }
  })

  // console.group('ProjectTeam')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('members...', members)
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

  function onCreateTeamMember(person:Person){
    if (person && project.id){
      const member = {
        ...person,
        position: members.length + 1
      }
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          member
        },
        delete: {
          open: false
        }
      })
    }
  }

  function onFoundPerson(person:AggregatedPerson){
    // debugger
    if (person && project?.id) {
      // check if this person is already in the list
      if (personAlreadyPresent(members,person)===true){
        showInfoMessage(`${person.display_name} already in the list, based on ORCID or account id.`)
        return true
      }
      // extract person props as much as possible (use null if not found)
      const member:Person = getPropsFromObject(person, PersonProps, true)
      // use first avatar (if exists)
      member.avatar_id = person.avatar_options[0] ?? null
      // use affiliation (if exists)
      member.affiliation = person.affiliation_options[0] ?? null
      // use role (if one)
      if (person.role_options.length===1){
        member.role = person.role_options[0]
      }
      // use email (if one)
      if (person.email_options.length===1){
        member.email_address = person.email_options[0]
      }
      // flag contact person to false
      member.is_contact_person = false
      // add position
      member.position = members.length + 1
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          member
        },
        delete: {
          open: false
        }
      })
    }
  }

  function onEditMember(pos:number) {
    // extract person props as much as possible (use null if not found)
    const member:Person = getPropsFromObject(members[pos], PersonProps, true)
    // show modal and pass data
    setModal({
      edit: {
        open: true,
        pos,
        member
      },
      delete: {
        open:false
      }
    })
  }

  function onSubmitMember({member, pos}: {member: FormPerson, pos?: number}) {
    hideModals()
    if (typeof pos == 'undefined'){
      addMember(member)
    } else {
      updateMember(member)
    }
  }

  function onDeleteMember(pos:number) {
    const member = members[pos]
    if (member) {
      setModal({
        edit: {
          open:false
        },
        delete: {
          pos,
          open: true,
          displayName: getDisplayName(member)
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
      <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{cfgTeamMembers.title}</span>
            <span>{members?.length}</span>
          </h2>
          <SortableTeamMemberList
            members={members}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
            onSorted={sortedMembers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={cfgTeamMembers.find.title}
            subtitle={cfgTeamMembers.find.subtitle(host?.orcid_search)}
          />
          <FindPerson
            onCreate={onCreateTeamMember}
            onAdd={onFoundPerson}
            config={{
              minLength: cfgTeamMembers.find.validation.minLength,
              label: cfgTeamMembers.find.label,
              help: cfgTeamMembers.find.help,
              // clear options after selection
              reset: true,
              // include ORCID api?
              include_orcid: host?.orcid_search
            }}
          />
          <ContributorPrivacyHint />
        </div>
      </EditSection>

      {modal.edit.open && modal.edit.member ?
        <AggregatedPersonModal
          title="Team member"
          person={modal.edit.member}
          onCancel={hideModals}
          onSubmit={(member)=>{
            onSubmitMember({member, pos: modal.edit.pos})
          }}
        />
        : null
      }

      {modal.delete.open ?
        <ConfirmDeleteModal
          open={modal.delete.open}
          title="Remove team member"
          body={
            <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? 'No name'}</strong>?</p>
          }
          onCancel={() => {
            setModal({
              edit:{open:false},
              delete:{open:false}
            })
          }}
          onDelete={()=>{
            if (typeof modal.delete.pos != 'undefined'){
              deleteMember(members[modal.delete.pos])
            }
            hideModals()
          }}
        />
        : null
      }
    </>
  )
}
