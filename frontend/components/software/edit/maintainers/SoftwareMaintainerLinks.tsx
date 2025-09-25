// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import InvitationList from '~/components/maintainers/InvitationList'
import useSoftwareContext from '../context/useSoftwareContext'
import {useSoftwareInvitations} from './useSoftwareInvitations'

export default function SoftwareMaintainerLinks() {
  const {software} = useSoftwareContext()
  const {unusedInvitations,createInvitation,deleteInvitation} = useSoftwareInvitations({software:software.id})

  // console.group('SoftwareMaintainerLinks')
  // console.log('software...', software)
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
        subject={`Maintainer invite for software ${encodeURIComponent(software.brand_name ?? '')}`}
        body={`Please use the following link to become a maintainer of ${encodeURIComponent(software.brand_name ?? '')} software.`}
        invitations={unusedInvitations}
        onDelete={deleteInvitation}
      />
    </>
  )
}
