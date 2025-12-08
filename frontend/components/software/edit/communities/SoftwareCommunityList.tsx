// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import {useSession} from '~/auth/AuthProvider'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {CommunitiesOfSoftware} from './apiSoftwareCommunities'
import SoftwareCommunityListItem from './SoftwareCommunityListItem'

type SoftwareCommunityListProps = Readonly<{
  communities: CommunitiesOfSoftware[]
  onEdit?: (community: CommunityListProps) => void
  onDelete: (id: string) => void
}>

export default function SoftwareCommunityList({communities, onEdit, onDelete}: SoftwareCommunityListProps) {
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
            <SoftwareCommunityListItem
              key={item.id}
              community={item}
              onEdit={onEdit}
              onDelete={userCanDelete ? onDelete : undefined}
            />
          )
        })
      }
    </List>
  )
}
