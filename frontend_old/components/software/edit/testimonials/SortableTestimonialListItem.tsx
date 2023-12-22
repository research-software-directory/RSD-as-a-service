// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {Testimonial} from '~/types/Testimonial'
import SortableListItem from '~/components/layout/SortableListItem'

export type SortableTestimonialItem = {
  pos: number,
  item: Testimonial
  onEdit:(pos:number)=>void,
  onDelete:(pos:number)=>void,
}

export default function SortableTestimonialListItem({pos,item,onEdit,onDelete}:SortableTestimonialItem){
  return (
    <SortableListItem
      data-testid="testimonial-list-item"
      key={item.id}
      pos={pos}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
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
    </SortableListItem>
  )
}
