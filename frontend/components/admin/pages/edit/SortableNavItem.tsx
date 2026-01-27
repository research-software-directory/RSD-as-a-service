// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
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
    <ListItem
      data-testid="sortable-nav-item"
      // draggable
      ref={setNodeRef}
      {...attributes}
      sx={{
        padding:'0',
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default',
      }}
    >
      <ListItemButton
        selected={item.slug === selected}
        onClick={() => onSelect(item)}
        disableGutters={true}
        sx={{
          gap: '0.5rem'
        }}
      >
        {/* drag-n-drop icon/button */}
        <div
          title="Drag to change position"
          aria-label="drag to change position"
          className="hover:cursor-move text-base-content-disabled"
          {...listeners}
        >
          <DragIndicatorIcon />
        </div>
        <ListItemIcon sx={{minWidth:'auto'}}>
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
    </ListItem>
  )
}
