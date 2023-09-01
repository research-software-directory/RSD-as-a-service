// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'

import {ProjectLink} from '~/types/Project'
import SortableListItem from '~/components/layout/SortableListItem'

type SortableProjectLinkProps = {
  pos: number,
  item: ProjectLink,
  onEdit: (pos: number) => void,
  onDelete: (pos: number) => void,
}

export default function SortableProjectLinksItem({pos, item, onEdit, onDelete}: SortableProjectLinkProps) {
  return (
    <SortableListItem
      data-testid="project-link-item"
      key={item.id}
      pos={pos}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <a href={item.url ?? undefined}
            target="_blank"
            rel="noreferrer"
          >
            {item.title}
          </a>
        }
      />
    </SortableListItem>
  )
}
