// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {getDisplayName} from '~/utils/getDisplayName'
import {sortOnStrProp} from '~/utils/sortFn'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {TeamMember} from '~/types/Project'
import {cfgTeamMembers} from './config'
import TeamMemberList from './TeamMemberList'
import FindMember from './FindMember'
import {
  createTeamMember, deleteTeamMemberById,
  ModalProps, ModalStates, updateTeamMember
} from './editTeamMembers'
import TeamMemberModal from './TeamMemberModal'
import useTeamMembers from './useTeamMembers'

type EditMemberModal = ModalProps & {
  member?: TeamMember
}

export default function ProjectTeam({slug}: { slug: string }) {
  const {showErrorMessage} = useSnackbar()
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
    if (typeof pos != 'undefined') {
      // update
      const newMembersList = [
        ...members.slice(0, pos),
        ...members.slice(pos+1),
        member
      ].sort((a, b) => sortOnStrProp(a, b, 'given_names'))
      setMembers(newMembersList)
    } else {
      // append
      const newMembersList = [
        ...members,
        member
      ].sort((a, b) => sortOnStrProp(a, b, 'given_names'))
      setMembers(newMembersList)
    }
  }

  function onEditMember(member: TeamMember,pos?:number) {
    if (member) {
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
        ]
        setMembers(newMembersList)
      } else {
        showErrorMessage(`Failed to remove member. ${resp.message}`)
      }
    }
  }

  async function onSubmitMember({data,pos}:{data: TeamMember, pos?: number}) {
    hideModals()
    if (!data.project) {
      // add project id
      data.project = project.id
    }
    if (data?.id && typeof pos != 'undefined') {
      const resp = await updateTeamMember({
        data,
        token
      })
      if (resp.status === 200) {
        // updated record delivered in message
        const member = resp.message
        updateLocalState(member,pos)
      } else {
        showErrorMessage(`Failed to update member. ${resp.message}`)
      }
    } else {
      const resp = await createTeamMember({
        data,
        token
      })
      if (resp.status === 201) {
        // updated record delivered in message
        const member = resp.message
        updateLocalState(member)
      } else {
        showErrorMessage(`Failed to add member. ${resp.message}`)
      }
    }
  }

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <>
      <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{cfgTeamMembers.title}</span>
            <span>{members?.length}</span>
          </h2>
          <TeamMemberList
            members={members}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
          />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <EditSectionTitle
            title={cfgTeamMembers.find.title}
            subtitle={cfgTeamMembers.find.subtitle}
          />
          <FindMember
            project={project.id}
            token={token}
            onAdd={onEditMember}
          />
        </div>
      </EditSection>

      <TeamMemberModal
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
    </>
  )
}
