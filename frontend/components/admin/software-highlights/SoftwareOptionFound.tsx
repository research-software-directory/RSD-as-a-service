// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {getImageUrl} from '~/utils/editImage'

export default function SoftwareOptionFound({option}: {option: AutocompleteOption<SoftwareOverviewItemProps>}) {

  const {brand_name, contributor_cnt, mention_cnt, image_id, is_published} = option.data

  return (
    <ListItem
      data-testid="admin-software-option"
      key={option.key}
      component="div"
    >
      <ListItemAvatar>
        <Avatar
          alt={brand_name ?? ''}
          src={getImageUrl(image_id ?? null) ?? undefined}
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
