// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

import ContributorAvatar from '~/components/software/ContributorAvatar'
import {combineRoleAndAffiliation, getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {Contributor} from '~/types/Contributor'

import {getImageUrl} from '~/utils/editImage'
import SortableListItem from '~/components/layout/SortableListItem'

type SortableContributorItemProps = {
  pos: number,
  item: Contributor,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}

export default function SortableContributorItem({pos, item, onEdit, onDelete}: SortableContributorItemProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const displayName = getDisplayName(item)
  const displayInitials = getDisplayInitials(item)
  const primaryText = item.is_contact_person ?
    <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
    : displayName

  return (
    <SortableListItem
      data-testid="contributor-item"
      key={item.id}
      pos={pos}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
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
