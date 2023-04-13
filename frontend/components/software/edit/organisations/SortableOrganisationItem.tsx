// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import BlockIcon from '@mui/icons-material/Block'

import {EditOrganisation} from '../../../../types/Organisation'
import {getImageUrl} from '~/utils/editImage'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

type OrganisationsListItemProps = {
  organisation: EditOrganisation
  pos: number
  onEdit: (pos:number)=>void
  onDelete: (pos:number)=>void
}

export default function SortableOrganisationsItem({organisation, pos, onEdit, onDelete}: OrganisationsListItemProps) {
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: organisation.id ?? ''})

  function getSecondaryActions(listeners:any) {
    if (organisation.status !== 'approved') {
      return (
        <div
          title={`Affiliation rejected by ${organisation.name}`}
        >
          <BlockIcon
            sx={{
              width: '4rem',
              height: '4rem',
              color: 'error.main',
              opacity:0.5
            }}
          />
        </div>
      )
    }
    if (organisation.canEdit) {
      return (
        <SortableListItemActions
          pos={pos}
          listeners={listeners}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    }
    return (
      <SortableListItemActions
        pos={pos}
        listeners={listeners}
        // onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }

  return (
    <ListItem
      data-testid="organisation-list-item"
      // draggable
      ref={setNodeRef}
      {...attributes}
      key={JSON.stringify(organisation)}
      secondaryAction={getSecondaryActions(listeners)}
      sx={{
        // position:'relative',
        // this makes space for buttons
        paddingRight:'7.5rem',
        '&:hover': {
          backgroundColor:'grey.100'
        },
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={organisation.name ?? ''}
          src={getImageUrl(organisation.logo_id) ?? undefined}
          sx={{
            width: '6rem',
            height: '6rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {organisation.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        data-testid="organisation-list-item-text"
        primary={
          <a href={`/organisations/${organisation.slug}`} target="_blank">
            {organisation.name}
          </a>
        }
        secondary={
          <>
            <span>{organisation.website}</span>
            <br/>
            <span>{organisation.ror_id}</span>
          </>
        }
      />
    </ListItem>
  )
}
