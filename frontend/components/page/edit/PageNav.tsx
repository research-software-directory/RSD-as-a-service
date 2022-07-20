// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'

import {RsdLink} from '~/config/rsdSettingsReducer'
import PageNavItem from './PageNavItem'

type PagesNavProps = {
  links: RsdLink[]
  selected: string,
  onSelect: (item: RsdLink) => void
  onDragEnd:({destination, source}: DropResult)=>void
}

export default function PagesNav({selected, links, onSelect, onDragEnd}: PagesNavProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {provided => (
          <List
            ref={provided.innerRef}
            sx={{
              width:'100%'
            }}
            {...provided.droppableProps}
          >
            {links.map((item, pos) => {
              return (
                <PageNavItem
                  key={item.id}
                  item={item}
                  index={pos}
                  selected={selected}
                  onSelect={onSelect}
                />
              )
            })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}
