// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import ListItemWithAction from '~/components/layout/ListItemWithAction'
import {PackageManager} from '~/components/software/edit/package-managers/apiPackageManager'
import PackageManagerItemBody from '~/components/software/edit/package-managers/PackageManagerItemBody'

type AdminPacManListItemProps=Readonly<{
  item: PackageManager,
  onEdit: ()=>void
  onDelete: ()=>void
}>

export default function AdminPacManListItem({item,onEdit,onDelete}:AdminPacManListItemProps) {
  return (
    <ListItemWithAction
      secondaryAction={
        <>
          <IconButton
            title="Edit package manager"
            edge="end"
            aria-label="edit"
            disabled={item.id===null}
            onClick={onEdit}
            sx={{margin: '0.5rem'}}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            title="Delete package manager"
            edge="end"
            aria-label="delete"
            disabled={item.id===null}
            onClick={onDelete}
            sx={{margin: '0.5rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <PackageManagerItemBody item={item} />
    </ListItemWithAction>
  )
}
