// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import {combineRoleAndAffiliation, getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import {Contributor} from '~/types/Contributor'

import {getImageUrl} from '~/utils/editImage'

type SortableContributorItemProps = {
  pos: number,
  item: Contributor,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}

export default function SortableContributorItem({pos, item, onEdit, onDelete}: SortableContributorItemProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})

  const displayName = getDisplayName(item)
  const displayInitials = getDisplayInitials(item)
  const primaryText = item.is_contact_person ?
    <><span>{displayName}</span><span className="text-primary"> (contact person)</span></>
    : displayName

  return (
    <ListItem
      data-testid="contributor-item"
      // draggable
      ref={setNodeRef}
      {...attributes}
      secondaryAction={
        <SortableListItemActions
          pos={pos}
          listeners={listeners}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
      sx={{
        // this makes space for buttons
        paddingRight:'11rem',
        '&:hover': {
          backgroundColor:'grey.100'
        },
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
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
    </ListItem>
  )
}
