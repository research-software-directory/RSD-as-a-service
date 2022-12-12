// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import SortableListItemActions from '~/components/layout/SortableListItemActions'

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {ProjectLink} from '~/types/Project'

type SortableProjectLinkProps = {
  pos: number,
  item: ProjectLink,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}


export default function SortableProjectLinksItem({pos, item, onEdit, onDelete}: SortableProjectLinkProps) {
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})
  return(
    <ListItem
      data-testid="project-link-item"
      // draggable
      ref={setNodeRef}
      {...attributes}
      // disableGutters
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
        paddingRight: '11rem',
        // fixed height to avoid deformed item during dragging
        // height:'4rem',
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
      <ListItemText
        disableTypography
        primary={
          <a href={item.url ?? undefined}
            target="_blank"
            rel="noreferrer"
          >
            {item.title}
          </a>
        }
      />
    </ListItem>
  )
}
