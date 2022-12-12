// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'

import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {Testimonial} from '~/types/Testimonial'
import SortableListItemActions from '~/components/layout/SortableListItemActions'

export type SortableTestimonialItem = {
  pos: number,
  item: Testimonial
  onEdit:(pos:number)=>void,
  onDelete:(pos:number)=>void,
}

export default function SortableTestimonialListItem({pos,item,onEdit,onDelete}:SortableTestimonialItem){
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id:item.id ?? ''})

  return (
    <ListItem
      data-testid="testimonial-list-item"
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
        paddingRight:'11rem',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
      }}
    >
      <ListItemAvatar>
        <span className='text-[3rem]'>{item?.position}</span>
      </ListItemAvatar>
      <ListItemText
        data-testid="testimonial-list-item-text"
        primary={item?.message}
        secondary={<span>- {item?.source}</span>}
      />
    </ListItem>
  )
}
