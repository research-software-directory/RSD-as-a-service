// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {
  DndContext, DragEndEvent, useSensor,
  useSensors, TouchSensor, MouseSensor,
  KeyboardSensor
} from '@dnd-kit/core'
import {restrictToParentElement, restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
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
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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
      // a11y improved screen reader communication during d-n-d
      accessibility={{
        announcements: {
          onDragStart({active}) {
            const index = items.findIndex(item => item.id === active.id)
            return `Picked up item at position ${index + 1} of ${items.length}. Use up and down arrow keys to reorder.`
          },
          onDragMove({active, over}) {
            if (over) {
              const activeIndex = items.findIndex(item => item.id === active.id)
              const overIndex = items.findIndex(item => item.id === over.id)
              return `Item moved from position ${activeIndex + 1} to position ${overIndex + 1} of ${items.length}.`
            }
            return 'Item is being dragged.'
          },
          onDragOver({over}) {
            if (over) {
              // const activeIndex = items.findIndex(item => item.id === active.id)
              const overIndex = items.findIndex(item => item.id === over.id)
              return `Item is hovering over position ${overIndex + 1} of ${items.length}.`
            }
            return 'Item is over a non-droppable area.'
          },
          onDragEnd({active, over}) {
            if (over) {
              const activeIndex = items.findIndex(item => item.id === active.id)
              const overIndex = items.findIndex(item => item.id === over.id)
              return `Dropped item. Reordered from position ${activeIndex + 1} to final position ${overIndex + 1}.`
            }
            return 'Dropped item.'
          },
          onDragCancel() {
            return 'Dragging cancelled. Item returned to its original position.'
          }
        }
      }}
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
