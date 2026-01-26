// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ProjectListItem} from '~/types/Project'
import NoContent from '~/components/layout/NoContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {ProjectLayoutType} from './search/ViewToggleGroup'
import ProjectCardContent from './cards/ProjectCardContent'
import ProjectListItemContent from './list/ProjectListItemContent'
import RsdOverviewList from 'app/(overviews)/components/layouts/RsdOverviewList'
import RsdOverviewGrid from 'app/(overviews)/components/layouts/RsdOverviewGrid'

type ProjectOverviewContentProps = {
  layout: ProjectLayoutType
  projects: ProjectListItem[]
}

export default function ProjectOverviewContent({layout, projects}: ProjectOverviewContentProps) {

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <RsdOverviewList>
        {projects.map(item => {
          return (
            <OverviewListItem
              key={item.id}
            >
              <Link
                data-testid="project-list-item"
                key={item.id}
                href={`/projects/${item.slug}`}
                className='flex-1 flex hover:text-inherit'
              >
                <ProjectListItemContent {...item} />
              </Link>
            </OverviewListItem>
          )
        })}
      </RsdOverviewList>
    )
  }
  // GRID as default
  return (
    <RsdOverviewGrid>
      {projects.map(item => {
        return (
          <Link
            key={item.id}
            data-testid="project-grid-card"
            href={`/projects/${item.slug}`}
            className="h-full hover:text-inherit"
          >
            <ProjectCardContent
              visibleKeywords={3}
              {...item}
            />
          </Link>
        )
      })}
    </RsdOverviewGrid>
  )
}
