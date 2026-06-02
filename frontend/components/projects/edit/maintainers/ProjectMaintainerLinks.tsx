// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import InvitationList, {Invitation} from '~/components/maintainers/InvitationList'
import StatusForReaders from '~/components/a11y/StatusForReaders'
import useProjectContext from '../context/useProjectContext'
import {useProjectInvitations} from './useProjectInvitations'

export default function ProjectMaintainerLinks() {
  const {project} = useProjectContext()
  const {unusedInvitations,createInvitation,deleteInvitation} = useProjectInvitations({project:project.id})
  // a11y feedback notifier state for dynamic list actions
  const [notification, setNotification] = useState('')

  // console.group('ProjectMaintainerLinks')
  // console.log('project...', project)
  // console.log('unusedInvitations...', unusedInvitations)
  // console.groupEnd()

  async function handleCreateInvitation() {
    try {
      setNotification('Generating new invitation link...')
      await createInvitation()
      setNotification('New invitation link successfully generated and added to the list below.')
    } catch {
      setNotification('Failed to generate invitation link. Please try again.')
    }
  }

  async function handleDeleteInvitation(inv: Invitation) {
    try {
      setNotification('Deleting invitation link...')
      await deleteInvitation(inv)
      setNotification('Invitation link successfully deleted.')
    } catch {
      setNotification('Failed to delete invitation link.')
    }
  }

  return (
    <>
      {/* a11y screen reader announcer */}
      <StatusForReaders
        message={notification}
        className="absolute w-px h-px p-0 -m-px overflow-hidden clip whitespace-nowrap border-0"
      />
      <Button
        variant='contained'
        sx={{
          margin: '1rem 0rem',
          display: 'flex',
          alignItems: 'center'
        }}
        // hide decorative icon from speech engines
        startIcon={<AutoFixHighIcon aria-hidden="true"/>}
        onClick={handleCreateInvitation}
      >
        Generate invite link
      </Button>
      <div className="py-4"></div>
      <InvitationList
        subject={`Maintainer invite for project ${encodeURIComponent(project.title ?? '')}`}
        body={`Please use the following link to become a maintainer of ${encodeURIComponent(project.title ?? '')} project.`}
        invitations={unusedInvitations}
        onDelete={handleDeleteInvitation}
      />
    </>
  )
}
