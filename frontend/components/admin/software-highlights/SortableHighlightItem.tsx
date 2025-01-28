// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

import {getImageUrl} from '~/utils/editImage'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import {SoftwareHighlight} from './apiSoftwareHighlights'

type HighlightProps = {
  pos: number,
  item: SoftwareHighlight,
  inCarousel: boolean,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}

export default function SortableHighlightItem({pos,item,inCarousel,onEdit,onDelete}: HighlightProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {
    attributes,listeners,setNodeRef,
    transform,transition,isDragging
  } = useSortable({id: item.id ?? ''})

  const {brand_name, contributor_cnt, mention_cnt, image_id, is_published} = item

  return (
    <ListItem
      data-testid="admin-highlight-item"
      // draggable
      ref={setNodeRef}
      {...attributes}
      secondaryAction={
        <SortableListItemActions
          pos={pos}
          listeners={listeners}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
      sx={{
        // this makes space for buttons
        paddingRight: '11rem',
        // height:'5rem',
        '&:hover': {
          backgroundColor:'grey.100'
        },
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? 'grey.100' : 'paper',
        zIndex: isDragging ? 9:0,
        cursor: isDragging ? 'move' : 'default'
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
    </ListItem>
  )
}
