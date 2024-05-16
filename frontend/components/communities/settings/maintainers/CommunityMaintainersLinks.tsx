// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import InvitationList from '~/components/maintainers/InvitationList'
import {useCommunityContext} from '~/components/communities/context'
import {useCommunityInvitations} from './useCommunityInvitations'

export default function CommunityMaintainerLinks() {
  const {community} = useCommunityContext()
  const {unusedInvitations,createInvitation,deleteInvitation} = useCommunityInvitations({community:community?.id ?? ''})

  // console.group('CommunityMaintainerLinks')
  // console.log('id...', id)
  // console.log('name...', name)
  // console.log('magicLink...', magicLink)
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
        subject={`Maintainer invite for community ${encodeURIComponent(community?.name ?? '')}`}
        body={`Please use the following link to become a maintainer of ${encodeURIComponent(community?.name ?? '')} community.`}
        invitations={unusedInvitations}
        onDelete={deleteInvitation}
      />
    </>
  )
}
