// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import GenerateInviteLink from '~/components/maintainers/GenerateInviteLink'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import {useSoftwareInvitations} from './useSoftwareInvitations'

export default function SoftwareMaintainerLinks() {
  const {software} = useSoftwareContext()
  const {unusedInvitations,notification,createInvitation,deleteInvitation} = useSoftwareInvitations({software:software.id})

  return (
    <GenerateInviteLink
      email={{
        subject: `Maintainer invite for software ${encodeURIComponent(software.brand_name ?? '')}`,
        body: `Please use the following link to become a maintainer of ${encodeURIComponent(software.brand_name ?? '')} software.`
      }}
      notification={notification}
      invitations={unusedInvitations}
      createInvitation={createInvitation}
      deleteInvitation={deleteInvitation}
    />
  )
}
