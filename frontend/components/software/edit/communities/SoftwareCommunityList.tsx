// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import {useSession} from '~/auth'
import {CommunitiesOfSoftware} from './apiSoftwareCommunities'
import SoftwareCommunityListItem from './SoftwareCommunityListItem'
import {CommunityListProps} from '~/components/communities/apiCommunities'

type OrganisationListProps = {
  readonly communities: CommunitiesOfSoftware[]
  readonly onEdit?: (community: CommunityListProps) => void
  readonly onDelete: (id: string) => void
}

export default function SoftwareCommunityList({communities, onEdit, onDelete}: OrganisationListProps) {
  const {user} = useSession()

  if (communities.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No community membership</AlertTitle>
        Apply for community membership using <strong>search</strong>!
      </Alert>
    )
  }

  return (
    <List>
      {
        communities.map(item => {
          // software maintainer cannot remove rejected community status
          const userCanDelete = user?.role === 'rsd_admin' || item.status !=='rejected'
          return (
            <SoftwareCommunityListItem key={item.id} community={item} onEdit={onEdit} onDelete={userCanDelete ? onDelete : undefined} />
          )
        })
      }
    </List>
  )
}
