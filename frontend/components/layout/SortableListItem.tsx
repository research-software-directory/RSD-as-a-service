// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import {SxProps, Theme} from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {RequiredListProps} from './SortableList'

type SortableListItemProps<T extends RequiredListProps> = {
  item: T,
  children: ReactNode | ReactNode[],
  sx?: SxProps<Theme> ,
  secondaryAction?: ReactNode
}

export default function SortableListItem<T extends RequiredListProps>({
  item, children, sx, secondaryAction, ...props}: SortableListItemProps<T>) {
  const {
    attributes,listeners,setNodeRef,
    setActivatorNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})

  //a11y FIX: Destructure "role" out of attributes so it doesn't apply to the <li> element
  const {role, ...cleanedAttributes} = attributes

  return (
    <ListItem
      data-testid="sortable-list-item"
      // draggable
      ref={setNodeRef}
      // Apply all other ARIA tags (like aria-describedby) without breaking semantic HTML structure
      {...cleanedAttributes}
      secondaryAction={secondaryAction}
      disablePadding={true}
      disableGutters={true}
      sx={{
        // dnd-styles
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default',
        // gap for mobile smaller
        gap:['0.25rem','1rem'],
        // secondary action (buttons section)
        '.MuiListItemSecondaryAction-root':{
          // Remove absolute positioning
          position: 'relative',
          // Remove any default transform
          transform: 'none',
          // Remove the default 'right' positioning
          right: 'auto',
          top: 'auto',
          // Remove any default padding
          padding: '0 0.5rem 0',
          display: 'flex',
          gap: '0.5rem'
        },
        padding:'0.5rem 0rem',
        ...sx
      }}
      {...props}
    >
      <div className="flex-1 flex gap-2 items-center justify-center overflow-hidden">
        {/* drag-n-drop button a11y compatible */}
        <IconButton
          // add ref for keyboard activation
          ref={setActivatorNodeRef}
          // pass the destructured role directly to your interactive handle button
          role={role}
          title="Drag to change position"
          aria-label="Drag handle, press Space to reorder"
          edge="start"
          className="hover:cursor-move text-base-content-disabled"
          sx={{
            marginLeft:0,
            cursor: isDragging ? 'move' : 'inherit'
          }}
          // Keep listeners attached specifically here
          {...listeners}
        >
          <DragIndicatorIcon />
        </IconButton>
        {children}
      </div>
    </ListItem>
  )
}
