// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {Testimonial} from '~/types/Testimonial'
import SortableList from '~/components/layout/SortableList'
import SortableTestimonialListItem from './SortableTestimonialListItem'

type SortableTestimonialProps={
  items: Testimonial[],
  onEdit:(pos:number)=>void,
  onDelete:(pos:number)=>void,
  onSorted:(items: Testimonial[])=>void
}

export default function SortableTestimonialList({items, onEdit, onDelete, onSorted}: SortableTestimonialProps) {
  if (items.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No testimonials</AlertTitle>
        Add one using <strong>ADD button!</strong>
      </Alert>
    )
  }
  /**
   * This method is called by SortableList component to enable
   * rendering of custom sortable items
   * @param item
   * @param index
   * @returns React.JSX.Element
   */
  function renderListItem(item:Testimonial,index:number) {
    return (
      <SortableTestimonialListItem
        key={JSON.stringify(item)}
        item={item}
        onEdit={()=>onEdit(index)}
        onDelete={()=>onDelete(index)}
      />
    )
  }

  return (
    <SortableList
      items={items}
      onRenderItem={renderListItem}
      onSorted={onSorted}
    />
  )
}
