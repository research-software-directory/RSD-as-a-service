// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ProjectListItem} from '~/types/Project'
import NoContent from '~/components/layout/NoContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {ProjectLayoutType} from './search/ViewToggleGroup'
import ProjectOverviewList from './list/ProjectOverviewList'
import ProjectCardContent from './cards/ProjectCardContent'
import ProjectOverviewGrid from './cards/ProjectOverviewGrid'
import ProjectListItemContent from './list/ProjectListItemContent'

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
      <ProjectOverviewList>
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
      </ProjectOverviewList>
    )
  }
  // GRID as default
  return (
    <ProjectOverviewGrid>
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
    </ProjectOverviewGrid>
  )
}
