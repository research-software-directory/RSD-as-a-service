// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import InvitationList from '~/components/maintainers/InvitationList'
import {useProjectInvitations} from './useProjectInvitations'
import useProjectContext from '../context/useProjectContext'

export default function ProjectMaintainerLinks() {
  const {project} = useProjectContext()
  const {unusedInvitations,createInvitation,deleteInvitation} = useProjectInvitations({project:project.id})

  // console.group('ProjectMaintainerLinks')
  // console.log('project...', project)
  // console.log('unusedInvitations...', unusedInvitations)
  // console.groupEnd()

  return (
    <>
      <Button
        variant='contained'
        sx={{
          margin: '1rem 0rem',
          display: 'flex',
          alignItems: 'center'
        }}
        startIcon={<AutoFixHighIcon />}
        onClick={createInvitation}
      >
        Generate invite link
      </Button>
      <div className="py-4"></div>
      <InvitationList
        subject={`Maintainer invite for project ${encodeURIComponent(project.title ?? '')}`}
        body={`Please use the following link to become a maintainer of ${encodeURIComponent(project.title ?? '')} project.`}
        invitations={unusedInvitations}
        onDelete={deleteInvitation}
      />
    </>
  )
}
