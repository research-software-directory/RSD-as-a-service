// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import CategoryIcon from '@mui/icons-material/Category'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'

type SortableListItemActionsProps = Readonly<{
  onService?:()=>void
  onCategory?:()=>void
  onEdit?:()=>void,
  onDelete?:()=>void,
}>

export default function SortableListItemActions({onService,onCategory,onEdit,onDelete}:SortableListItemActionsProps){
  function serviceAction() {
    if (typeof onService == 'function') {
      return (
        <IconButton
          title="Background services"
          aria-label="background services"
          onClick={onService}
        >
          <MiscellaneousServicesIcon />
        </IconButton>
      )
    }
    return null
  }

  function categoryAction() {
    if (typeof onCategory == 'function') {
      return (
        <IconButton
          title="Edit categories"
          aria-label="edit categories"
          onClick={() => {
            // alert(`Edit...${item.id}`)
            onCategory()
          }}
        >
          <CategoryIcon />
        </IconButton>
      )
    }
    return null
  }

  function editAction() {
    if (typeof onEdit == 'function') {
      return (
        <IconButton
          title="Edit"
          aria-label="edit"
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
      )
    }
    return null
  }

  function deleteAction() {
    if (typeof onDelete == 'function') {
      return (
        <IconButton
          title="Delete"
          aria-label="delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
    return null
  }

  return (
    <>
      {serviceAction()}
      {editAction()}
      {categoryAction()}
      {deleteAction()}
    </>
  )
}
