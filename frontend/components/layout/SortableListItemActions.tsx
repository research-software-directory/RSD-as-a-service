// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import CategoryIcon from '@mui/icons-material/Category'

type SortableListItemActionsProps = {
  pos: number
  listeners?: SyntheticListenerMap
  onEdit?:(pos:number)=>void,
  onDelete?:(pos:number)=>void,
  onCategory?:(pos:number)=>void
}

export default function SortableListItemActions({pos,listeners,onEdit,onDelete,onCategory}:SortableListItemActionsProps){

  function categoryAction() {
    if (typeof onCategory !== 'undefined') {
      return (
        <IconButton
          title="Edit categories"
          edge="end"
          aria-label="edit categories"
          sx={{marginRight: '1rem'}}
          onClick={() => {
            // alert(`Edit...${item.id}`)
            onCategory(pos)
          }}
        >
          <CategoryIcon />
        </IconButton>
      )
    }
    return null
  }

  function editAction() {
    if (typeof onEdit !== 'undefined') {
      return (
        <IconButton
          title="Edit"
          edge="end"
          aria-label="edit"
          sx={{marginRight: '1rem'}}
          onClick={() => {
            // alert(`Edit...${item.id}`)
            onEdit(pos)
          }}
        >
          <EditIcon />
        </IconButton>
      )
    }
    return null
  }

  function deleteAction() {
    if (typeof onDelete !== 'undefined') {
      return (
        <IconButton
          title="Delete"
          edge="end"
          aria-label="delete"
          onClick={() => {
            onDelete(pos)
          }}
          sx={{marginRight: '1rem'}}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
    return null
  }

  function dragAction() {
    if (typeof listeners !== 'undefined') {
      return (
        <IconButton
          title="Drag to change position"
          edge="end"
          aria-label="drag to change position"
          {...listeners}
        >
          <DragIndicatorIcon />
        </IconButton>
      )
    }
    return null
  }

  return (
    <>
      {categoryAction()}
      {editAction()}
      {deleteAction()}
      {dragAction()}
    </>
  )
}
