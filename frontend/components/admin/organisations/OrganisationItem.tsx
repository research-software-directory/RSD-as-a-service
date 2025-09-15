// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'

import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import {getImageUrl} from '~/utils/editImage'
import {OrganisationAdminProps} from './apiOrganisation'


type OrganisationItemProps = {
  item: OrganisationAdminProps,
  onDelete: () => void
}

export default function OrganisationItem({item, onDelete}: OrganisationItemProps) {
  return (
    <ListItem
      data-testid="admin-organisation-item"
      key={item.id}
      secondaryAction={
        <>
          <IconButton
            title="Delete organisation"
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
      {/* open organisation settings for edit */}
      <Link
        data-test-id="edit-organisation"
        title="Click to edit organisation settings"
        href={`/organisations/${item.rsd_path}?tab=settings`}
        className="flex-1 flex justify-center items-center hover:text-inherit"
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
      </Link>
    </ListItem>
  )
}
