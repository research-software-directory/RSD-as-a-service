// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import {getImageUrl} from '~/utils/editImage'
import ListItemText from '@mui/material/ListItemText'

type SoftwareHighlightItemProps = {
  data: SoftwareListItem,
  onDelete: ()=>void
}

export default function SoftwareHighlightItem({data, onDelete}: SoftwareHighlightItemProps) {

  const {brand_name, contributor_cnt, mention_cnt, slug, image_id, is_published} = data

  return (
    <ListItem
      data-testid="admin-hightlight-item"
      key={slug}
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            href={`/software/${slug}/edit`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
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
          alt={brand_name ?? ''}
          src={getImageUrl(image_id ?? null) ?? undefined}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '3rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {brand_name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={brand_name}
        secondary={
          <>
            <span>Mentions: {mention_cnt ?? 0}</span>
            <span className="ml-4">Contributors: {contributor_cnt ?? 0}</span>
            <span className="ml-4">Published: {is_published ? 'Yes' : 'No'}</span>
          </>
        }
      />
    </ListItem>
  )
}
