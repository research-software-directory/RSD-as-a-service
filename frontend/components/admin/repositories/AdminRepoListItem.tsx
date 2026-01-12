// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'
import RepositoryItemContent from '~/components/software/edit/repositories/RepositoryItemContent'

type AdminRepoListItemProps=Readonly<{
  item: RepositoryUrl,
  onEdit: ()=>void
  onDelete: ()=>void
}>

export default function AdminRepoListItem({item,onEdit,onDelete}:AdminRepoListItemProps) {
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            title="Edit repository"
            edge="end"
            aria-label="edit"
            disabled={item.id===null}
            onClick={onEdit}
            sx={{margin: '0.5rem'}}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            title="Delete repository"
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
      <RepositoryItemContent item={item}/>
    </ListItem>
  )
}
