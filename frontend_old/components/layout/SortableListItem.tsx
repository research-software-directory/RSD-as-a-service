// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ListItem from '@mui/material/ListItem'
import {RequiredListProps} from './SortableList'
import SortableListItemActions from './SortableListItemActions'

type SortableListItemProps<T extends RequiredListProps> = {
  pos: number,
  item: T,
  onEdit?: (pos: number) => void,
  onDelete?: (pos: number) => void,
  children: any,
  sx?: any,
}

export default function SortableListItem<T extends RequiredListProps>({
  pos, item, onEdit, onDelete, children, sx, ...props}: SortableListItemProps<T>) {
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})

  return (
    <ListItem
      data-testid="sortable-list-item"
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
        // dnd-styles
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default',
        // this reserves space for 3 buttons
        paddingRight:'11rem',
        // passed sx styles
        ...sx
      }}
      {...props}
    >
      {children}
    </ListItem>
  )
}
