// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import config from './config'

type OrganisationItemProps = {
  item: CommunityListProps,
  onDelete: () => void
}

export default function CommunityListItem({item, onDelete}: OrganisationItemProps) {
  const deleteDisabled = item.software_cnt ? item.software_cnt > 0 : false

  function isDeletedDisabled(){
    // if any of software in community
    if (item.software_cnt && item?.software_cnt > 0 ) return true
    if (item.rejected_cnt && item?.rejected_cnt > 0 ) return true
    if (item.pending_cnt && item?.pending_cnt > 0 ) return true
    // if keywords are defined
    if (item.keywords && item.keywords?.length > 0 ) return true
    // otherwise it can be deleted
    return false
  }

  return (
    <ListItem
      data-testid="admin-community-item"
      key={item.id}
      secondaryAction={
        <>
          {/* onEdit we open community settings */}
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            href={`/${config.rsdRootPath}/${item.slug}/settings`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            disabled={isDeletedDisabled()}
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
            <span>{item.short_description}</span>
            <br/>
            <span className="flex gap-2">
              <span>Software: {item.software_cnt ?? 0}</span>
              <span>Pending requests: {item.pending_cnt ?? 0}</span>
              <span>Rejected requests: {item.rejected_cnt ?? 0}</span>
              <span>Keywords: {item.keywords?.length ?? 0}</span>
            </span>
          </>
        }
      />
    </ListItem>
  )
}
