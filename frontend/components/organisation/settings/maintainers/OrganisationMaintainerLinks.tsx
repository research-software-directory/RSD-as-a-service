// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import InvitationList from '~/components/maintainers/InvitationList'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import {useOrganisationInvitations} from './useOrganisationInvitations'

export default function OrganisationMaintainerLinks() {
  const {id,name} = useOrganisationContext()
  const {unusedInvitations,createInvitation,deleteInvitation} = useOrganisationInvitations({organisation:id})

  // console.group('OrganisationMaintainerLinks')
  // console.log('id...', id)
  // console.log('name...', name)
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
        subject={`Maintainer invite for organisation ${encodeURIComponent(name ?? '')}`}
        body={`Please use the following link to become a maintainer of ${encodeURIComponent(name ?? '')} organisation.`}
        invitations={unusedInvitations}
        onDelete={deleteInvitation}
      />
    </>
  )
}
