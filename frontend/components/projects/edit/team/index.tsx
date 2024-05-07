// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {getDisplayName} from '~/utils/getDisplayName'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {SaveTeamMember, TeamMember} from '~/types/Project'
import {cfgTeamMembers} from './config'
import FindMember from './FindMember'
import {
  deleteTeamMemberById, ModalProps,
  ModalStates, patchTeamMemberPositions,
} from './editTeamMembers'
import EditTeamMemberModal from './EditTeamMemberModal'
import useTeamMembers from './useTeamMembers'
import SortableTeamMemberList from './SortableTeamMemberList'
import {deleteImage} from '~/utils/editImage'
import ContributorPrivacyHint from '~/components/layout/ContributorPrivacyHint'
import useProjectContext from '../useProjectContext'

type EditMemberModal = ModalProps & {
  member?: TeamMember
}

export default function ProjectTeam() {
  const {showErrorMessage} = useSnackbar()
  const {project:{slug}} = useProjectContext()
  const {token,loading,project,members,setMembers} = useTeamMembers({slug})
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
  // console.log('slug...', slug)
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('token...', token)
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

  function updateLocalState(member: TeamMember, pos?: number) {
    if (typeof pos !== 'undefined') {
      // update
      const newMembersList = members.map((item, i) => {
        if (i === pos) return member
        return item
      })
      updateContactPeople(member, newMembersList)
      setMembers(newMembersList)
    } else {
      // append to bottom
      const newMembersList = [
        ...members,
        member
      ]
      updateContactPeople(member, newMembersList)
      setMembers(newMembersList)
    }
  }

  async function updateContactPeople(data: TeamMember, list: TeamMember[]) {
    if (!data.is_contact_person) return

    list.forEach(person => {
      if (!person.is_contact_person || person === data) return
      fetch(`/api/v1/team_member?id=eq.${person.id}`, {
        method: 'PATCH',
        body: JSON.stringify({is_contact_person: false}),
        headers: {'content-type': 'application/json', Authorization: 'Bearer ' + token}
      })
      person.is_contact_person = false
    })
  }

  function onEditMember(member: SaveTeamMember,pos?:number) {
    if (member && project.id) {
      // add project id
      member.project = project.id
      if (typeof pos==='undefined') {
        // this is new member and we need to add position
        member.position = members.length + 1
      }
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

  async function deleteMember(pos: number) {
    hideModals()
    const member = members[pos]
    if (member) {
      const resp = await deleteTeamMemberById({
        ids: [member?.id ?? ''],
        token
      })
      if (resp.status === 200) {
        const newMembersList = [
          ...members.slice(0, pos),
          ...members.slice(pos+1)
        ].map((item, pos) => {
          // renumber
          item.position = pos + 1
          return item
        })
        // renumber remaining members
        await sortTeamMembers(newMembersList)
        // try to remove member avatar
        // without waiting for result
        if (member.avatar_id) {
          const del = await deleteImage({
            id: member.avatar_id,
            token
          })
        }
      } else {
        showErrorMessage(`Failed to remove member. ${resp.message}`)
      }
    }
  }

  function onSubmitMember({member, pos}: { member: SaveTeamMember, pos?: number }) {
    // update local state
    updateLocalState(member, pos)
    hideModals()
  }

  async function sortTeamMembers(newList: TeamMember[]) {
    // patch only if there are items left
    if (newList.length > 0) {
      // apply ui change first to avoid lag
      setMembers(newList)
      // patch db
      const resp = await patchTeamMemberPositions({
        members:newList,
        token
      })
      if (resp.status !== 200) {
        // revert back in case of failure
        setMembers(members)
        showErrorMessage(`Failed to update team positions. ${resp.message}`)
      }
    } else {
      // clear list
      setMembers([])
    }
  }

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <>
      <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{cfgTeamMembers.title}</span>
            <span>{members?.length}</span>
          </h2>
          <SortableTeamMemberList
            members={members}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
            onSorted={sortTeamMembers}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={cfgTeamMembers.find.title}
            subtitle={cfgTeamMembers.find.subtitle}
          />
          <FindMember
            project={project.id}
            position={members.length + 1}
            onEdit={onEditMember}
            onSubmit={onSubmitMember}
          />
          <ContributorPrivacyHint />
        </div>
      </EditSection>

      {modal.edit.open &&
        <EditTeamMemberModal
          open={modal.edit.open}
          pos={modal.edit.pos}
          member={modal.edit.member}
          onCancel={() => {
            setModal({
              edit:{open:false},
              delete:{open:false}
            })
          }}
          onSubmit={onSubmitMember}
        />
      }
      {modal.delete.open &&
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
          onDelete={()=>deleteMember(modal.delete.pos ?? 0)}
        />
      }
    </>
  )
}
