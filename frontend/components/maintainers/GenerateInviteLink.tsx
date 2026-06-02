// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import StatusForReaders from '~/components/a11y/StatusForReaders'
import InvitationList, {Invitation} from '~/components/maintainers/InvitationList'

type GenerateInviteLinkProps=Readonly<{
  email:{
    subject: string
    body: string
  },
  notification: string,
  invitations: Invitation[],
  createInvitation: ()=>Promise<void>
  deleteInvitation: (invitation:Invitation)=>Promise<void>
}>

export default function GenerateInviteLink(props:GenerateInviteLinkProps) {
  // destructure props
  const {email,notification,invitations,createInvitation,deleteInvitation} = props

  return (
    <div className="grid gap-4 justify-items-start">
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
        onClick={createInvitation}
      >
        Generate invite link
      </Button>
      <InvitationList
        subject={email.subject}
        body={email.body}
        invitations={invitations}
        onDelete={deleteInvitation}
      />
    </div>
  )

}
