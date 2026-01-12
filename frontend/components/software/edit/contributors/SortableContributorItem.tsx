// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

import {combineRoleAndAffiliation, getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {Contributor} from '~/types/Contributor'
import {TeamMember} from '~/types/Project'
import {getImageUrl} from '~/utils/editImage'
import useSmallScreen from '~/config/useSmallScreen'
import SortableListItem from '~/components/layout/SortableListItem'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import ContributorAvatar from '~/components/software/ContributorAvatar'

type SortableContributorItemProps = Readonly<{
  item: Contributor | TeamMember,
  onEdit: () => void,
  onDelete: () => void,
}>

export default function SortableContributorItem({item, onEdit, onDelete}: SortableContributorItemProps) {
  const smallScreen = useSmallScreen()
  const displayName = getDisplayName(item)
  const displayInitials = getDisplayInitials(item)
  const primaryText = item.is_contact_person ?
    <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
    : displayName

  return (
    <SortableListItem
      data-testid="contributor-item"
      key={item.id}
      item={item}
      secondaryAction={
        <SortableListItemActions
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      {smallScreen ? null :
        <ListItemAvatar>
          <ContributorAvatar
            avatarUrl={getImageUrl(item.avatar_id) ?? ''}
            displayName={displayName ?? ''}
            displayInitials={displayInitials}
          />
        </ListItemAvatar>
      }
      <ListItemText primary={primaryText} secondary={combineRoleAndAffiliation(item)} />
    </SortableListItem>
  )
}
