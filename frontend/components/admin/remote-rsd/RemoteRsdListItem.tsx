// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

import {RemoteRsd} from './apiRemoteRsd'

type RemoteRsdItemProps = Readonly<{
  item: RemoteRsd,
  onDelete: () => void
  onEdit: () => void
}>

export default function RemoteRsdListItem({item, onEdit, onDelete}: RemoteRsdItemProps) {
  const logo = `${item.domain}/favicon.ico`
  return (
    <ListItem
      data-testid="admin-remote-rsd-item"
      key={item.id}
      secondaryAction={
        <>
          <IconButton
            title="Edit remote rsd"
            edge="end"
            aria-label="edit"
            onClick={() => {
              onEdit()
            }}
            sx={{marginRight: '1rem'}}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            title="Delete remote rsd"
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete()
            }}
            sx={{margin: '0rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      className="transition shadow-xs border bg-base-100 rounded-sm hover:shadow-lg"
      sx={{
        // this makes space for buttons
        padding:'0.5rem 4.5rem 0.5rem 1rem',
        margin: '0.5rem 0rem'
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={item.label ?? ''}
          src={logo ?? undefined}
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
          {item.label.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.label}
        secondary={
          <>
            <span>{item.domain}</span>
            <br/>
            <span className="flex gap-2">
              {item.active ?
                <span className="text-success">Update every {item.scrape_interval_minutes ?? 0} minutes.</span>
                :
                <span className="text-warning">Not active.</span>
              }
              {item.active ?
                <span>Last update: {item.scraped_at ? new Date(item.scraped_at).toLocaleString() : 'never'}</span>
                : null
              }
              {item.last_err_msg ?
                <span className='text-error'>Last error: {item.last_err_msg ?? 'no errors'}</span>
                : null
              }
            </span>
          </>
        }
      />

    </ListItem>
  )
}
