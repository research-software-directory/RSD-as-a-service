// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {ProjectListItem} from '~/types/Project'
import NoContent from '~/components/layout/NoContent'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import ProjectOverviewList from '~/components/projects/overview/list/ProjectOverviewList'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'

type ProfileProjectOverviewProps = {
  layout: ProjectLayoutType
  projects: ProjectListItem[]
}

export default function ProfileProjectOverview({layout,projects}:ProfileProjectOverviewProps) {

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <ProjectOverviewList>
        {projects.map(item => {
          return (
            <Link
              data-testid="project-list-item"
              key={item.id}
              href={`/projects/${item.slug}`}
              className='flex-1 hover:text-inherit'
              title={item.title}
            >
              <OverviewListItem className='pr-4'>
                <ProjectListItemContent key={item.id} {...item} />
              </OverviewListItem>
            </Link>
          )
        })}
      </ProjectOverviewList>
    )
  }

  // GRID as default
  return (
    <SoftwareOverviewGrid fullWidth={true}>
      {projects.map((item) => {
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
    </SoftwareOverviewGrid>
  )

}
