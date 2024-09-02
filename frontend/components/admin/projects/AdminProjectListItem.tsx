// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {ProjectListItem} from '~/types/Project'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import StatusBanner from '~/components/cards/StatusBanner'

type ProjectListItemProps = {
  project:ProjectListItem
  onDelete: ()=>void
}

export default function AdminProjectListItem({project,onDelete}:ProjectListItemProps) {
  return (
    <OverviewListItem>
      {/* standard project list item with link */}
      <Link
        data-testid="project-grid-card"
        title="Click to edit project"
        href={`/projects/${project.slug}/edit/information`}
        className="flex-1 flex hover:text-inherit"
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
      </Link>

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
