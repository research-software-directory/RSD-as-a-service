// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import {OrganisationList} from '~/types/Organisation'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import {getImageUrl} from '~/utils/editImage'

type OrganisationItemProps = {
  item: OrganisationList,
  onDelete: () => void
}

export default function OrganisationItem({item, onDelete}: OrganisationItemProps) {
  const router = useRouter()
  return (
    <ListItem
      data-testid="admin-organisation-item"
      key={item.id}
      secondaryAction={
        <>
          {/* onEdit we open organisation settings */}
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            href={`/organisations/${item.rsd_path}?page=settings`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            disabled={item.software_cnt > 0 || item.project_cnt > 0}
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete()
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      sx={{
        // this makes space for buttons
        paddingRight:'6.5rem',
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={item.name ?? ''}
          src={getImageUrl(item.logo_id) ?? undefined}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '1.5rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {item.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.name}
        secondary={
          <>
            <span>Software: {item.software_cnt ?? 0}</span>
            <span className="ml-4">Projects: {item.project_cnt ?? 0}</span>
          </>
        }
      />
    </ListItem>
  )
}
