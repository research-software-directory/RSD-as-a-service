// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {
  DndContext, DragEndEvent, useSensor,
  useSensors, TouchSensor, MouseSensor
} from '@dnd-kit/core'
import {restrictToParentElement, restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import List from '@mui/material/List'


export type RequiredListProps = {
  id: string | null,
  position: number | null
}

type SortableListProps<T extends RequiredListProps>={
  items:T[],
  onSorted: (items: T[]) => void
  onRenderItem:(item:T,index:number) => JSX.Element
}

export default function SortableList<T extends RequiredListProps>({
  items, onSorted, onRenderItem}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(MouseSensor,{
      // required to enable click events
      // on draggable items with buttons
      // activationConstraint: {
      //   distance: 8,
      // }
    })
  )

  function onDragEnd({active, over}: DragEndEvent) {
    // console.group('onDragEnd')
    // console.log('active...', active)
    // console.log('over...', over)
    // console.groupEnd()
    if (over && active.id!==over?.id){
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
        .map((item, pos) => {
          return {
            ...item,
            // update position after dragging
            position: pos + 1
          }
        })
      // debugger
      onSorted(newItems)
    }
  }

  if (items.length===0) return null

  return (
    <DndContext
      // id is required in SSR mode
      // see https://github.com/clauderic/dnd-kit/issues/285
      id={'sortable-list'}
      onDragEnd={onDragEnd}
      sensors={sensors}
      modifiers={[restrictToVerticalAxis,restrictToParentElement]}
    >
      <SortableContext
        items={items.map(item=>({id: item.id ?? ''}))}
        strategy={verticalListSortingStrategy}
      >
        <List>
          {items.map((item,index)=>onRenderItem(item,index))}
        </List>
      </SortableContext>
    </DndContext>
  )
}
