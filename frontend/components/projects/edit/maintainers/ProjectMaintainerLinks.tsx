// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import GenerateInviteLink from '~/components/maintainers/GenerateInviteLink'
import useProjectContext from '../context/useProjectContext'
import {useProjectInvitations} from './useProjectInvitations'

export default function ProjectMaintainerLinks() {
  const {project} = useProjectContext()
  const {unusedInvitations,notification,createInvitation,deleteInvitation} = useProjectInvitations({project:project.id})

  return (
    <GenerateInviteLink
      email={{
        subject: `Maintainer invite for project ${encodeURIComponent(project.title ?? '')}`,
        body: `Please use the following link to become a maintainer of ${encodeURIComponent(project.title ?? '')} project.`
      }}
      notification={notification}
      invitations={unusedInvitations}
      createInvitation={createInvitation}
      deleteInvitation={deleteInvitation}
    />
  )
}
