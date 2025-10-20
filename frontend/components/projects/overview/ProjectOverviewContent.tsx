// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {ProjectListItem} from '~/types/Project'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import ProjectOverviewList from './list/ProjectOverviewList'
import ProjectListItemContent from './list/ProjectListItemContent'
import ProjectCardContent from './cards/ProjectCardContent'

type ProjectOverviewContentProps = Readonly<{
  projects: ProjectListItem[]
}>

export default function ProjectOverviewContent({projects}: ProjectOverviewContentProps) {
  const {rsd_page_layout} = useUserSettings()

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (rsd_page_layout === 'list') {
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
    <GridOverview className="mt-2 auto-rows-[28rem]">
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
    </GridOverview>
  )
}
