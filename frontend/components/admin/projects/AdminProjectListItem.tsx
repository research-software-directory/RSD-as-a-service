// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {ProjectListItem} from '~/types/Project'
import StatusBanner from '~/components/cards/StatusBanner'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'

type ProjectListItemProps = {
  project:ProjectListItem
  onDelete: ()=>void
}

export default function AdminProjectListItem({project,onDelete}:ProjectListItemProps) {
  return (
    <OverviewListItem>
      {/* standard project list item with link */}
      <OverviewListItemLink
        href={`/projects/${project.slug}/edit/information`}
      >
        <ProjectListItemContent
          statusBanner={
            <StatusBanner
              status={'approved'}
              is_featured={false}
              is_published={project.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...project}
        />
      </OverviewListItemLink>
      {/* admin menu */}
      <div className="flex mr-4">
        <IconButton
          title = "Delete project"
          edge="end"
          aria-label="delete"
          onClick={onDelete}
          sx={{margin: '0rem'}}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </OverviewListItem>
  )
}
