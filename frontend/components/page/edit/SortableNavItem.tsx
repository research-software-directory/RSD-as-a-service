// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {RsdLink} from '~/config/rsdSettingsReducer'

export type DraggableListItemProps = {
  item: RsdLink
  selected: string
  index: number
  onSelect: (item: RsdLink) => void
}

export default function SortableNavItem({item, selected, index, onSelect}: DraggableListItemProps) {
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})

  return (
    <ListItemButton
      // draggable
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      selected={item.slug === selected}
      onClick={() => onSelect(item)}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
      }}
    >
      <ListItemIcon>
        <span className='text-[2rem]'>{item?.position ?? index+1}</span>
      </ListItemIcon>
      <ListItemText
        primary={
          <span className={`${item.is_published ? '' : 'text-base-content-disabled'}`}>
            {item.title}
          </span>
        }
      />
    </ListItemButton>
  )
}
