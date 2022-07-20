// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {Draggable} from 'react-beautiful-dnd'
import {RsdLink} from '~/config/rsdSettingsReducer'

export type DraggableListItemProps = {
  item: RsdLink
  selected: string
  index: number
  onSelect: (item: RsdLink) => void
}

export default function PageNavItem({item,selected,index,onSelect}:DraggableListItemProps) {
  return (
    <Draggable draggableId={item?.id??''} index={index}>
      {(provided, snapshot) => (
        <ListItemButton
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          selected={item.slug === selected}
          sx={{
            backgroundColor: snapshot.isDragging ? 'divider' : 'paper'
          }}
          onClick={()=>onSelect(item)}
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
      )}
    </Draggable>
  )
}
