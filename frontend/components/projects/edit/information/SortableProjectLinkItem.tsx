// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'

import {ProjectLink} from '~/types/Project'
import SortableListItem from '~/components/layout/SortableListItem'
import SortableListItemActions from '~/components/layout/SortableListItemActions'

type SortableProjectLinkProps = Readonly<{
  item: ProjectLink,
  onEdit: () => void,
  onDelete: () => void,
}>

export default function SortableProjectLinksItem({item, onEdit, onDelete}: SortableProjectLinkProps) {
  return (
    <SortableListItem
      data-testid="project-link-item"
      key={item.id}
      item={item}
      secondaryAction={
        <SortableListItemActions
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
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
