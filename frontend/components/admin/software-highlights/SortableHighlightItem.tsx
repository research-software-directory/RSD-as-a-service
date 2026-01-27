// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import useSmallScreen from '~/config/useSmallScreen'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import SortableListItem from '~/components/layout/SortableListItem'
import {SoftwareHighlight} from './apiSoftwareHighlights'

type HighlightProps = Readonly<{
  item: SoftwareHighlight,
  inCarousel: boolean,
  onEdit: () => void,
  onDelete: () => void,
}>

export default function SortableHighlightItem({item,inCarousel,onEdit,onDelete}: HighlightProps) {
  const smallScreen = useSmallScreen()

  const {brand_name, contributor_cnt, mention_cnt, image_id, is_published} = item

  return (
    <SortableListItem
      data-testid="admin-highlight-item"
      item = {item}
      secondaryAction={
        <SortableListItemActions
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        }
      }}
    >
      {smallScreen ? null :
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
      }
      <ListItemText
        primary={brand_name}
        secondary={
          <>
            <span>Mentions: {mention_cnt ?? 0}</span>
            <span className="ml-4">Contributors: {contributor_cnt ?? 0}</span>
            <span className="ml-4">Published: {is_published ? 'Yes' : 'No'}</span>
            <span className="ml-4">Carousel: {inCarousel ? 'Yes' : 'No'}</span>
          </>
        }
      />
    </SortableListItem>
  )
}
