// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {Testimonial} from '~/types/Testimonial'

export type SortableTestimonialItem = {
  item: Testimonial
  secondaryAction: JSX.Element
}

export default function SortableTestimonialListItem({item,secondaryAction}:SortableTestimonialItem){
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id:item.id ?? ''})

  return (
    <ListItem
      // draggable
      ref={setNodeRef}
      // style={style}
      {...attributes}
      {...listeners}
      sx={{
        paddingRight:'8rem',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
      }}
      secondaryAction={secondaryAction}
    >
      <ListItemAvatar>
        <span className='text-[3rem]'>{item?.position}</span>
      </ListItemAvatar>
      <ListItemText
        primary={item?.message}
        secondary={<span>- {item?.source}</span>}
      />
    </ListItem>
  )
}
