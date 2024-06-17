// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {getImageUrl} from '~/utils/editImage'
import {CommunitiesOfSoftware} from './apiSoftwareCommunities'
import CommunityStatusBanner from './CommunityStatusBanner'

type SoftwareCommunityItemProps={
  community: CommunitiesOfSoftware
  onDelete?: (id: string) => void
}

export default function SoftwareCommunityListItem({community,onDelete}:SoftwareCommunityItemProps) {
  return (
    <ListItem
      data-testid="software-community-item"
      key={community.id}
      secondaryAction={
        <IconButton
          title="Delete"
          edge="end"
          aria-label="delete"
          onClick={() => {
            if (onDelete) onDelete(community.id)
          }}
          sx={{marginRight: '1rem'}}
          disabled={typeof onDelete == 'undefined'}
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{
        // position:'relative',
        // this makes space for buttons
        paddingRight:'7.5rem',
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      <div className="absolute top-[0.5rem] w-[7rem] right-0 opacity-90 font-medium">
        <CommunityStatusBanner
          status={community.status}
          borderRadius='0.125rem'
        />
      </div>
      <ListItemAvatar sx={{
        position:'relative'
      }}>
        <Avatar
          alt={community.name ?? ''}
          src={getImageUrl(community.logo_id) ?? undefined}
          sx={{
            width: '6rem',
            height: '6rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {community.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        data-testid="software-community-item-text"
        primary={
          <a href={`/communities/${community.slug}`}>
            {community.name}
          </a>
        }
        secondary={community.short_description}
      />
    </ListItem>
  )
}
