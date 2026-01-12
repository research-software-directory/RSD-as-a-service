// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import {Testimonial} from '~/types/Testimonial'
import SortableListItem from '~/components/layout/SortableListItem'
import SortableListItemActions from '~/components/layout/SortableListItemActions'

export type SortableTestimonialItem = Readonly<{
  item: Testimonial
  onEdit:()=>void,
  onDelete:()=>void,
}>

export default function SortableTestimonialListItem({item,onEdit,onDelete}:SortableTestimonialItem){
  return (
    <SortableListItem
      data-testid="testimonial-list-item"
      key={item.id}
      item={item}
      secondaryAction={
        <SortableListItemActions
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
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
