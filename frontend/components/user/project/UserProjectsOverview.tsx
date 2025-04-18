// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import NoContent from '~/components/layout/NoContent'
import CardSkeleton from '~/components/cards/CardSkeleton'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import ProjectOverviewList from '~/components/projects/overview/list/ProjectOverviewList'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import {ProjectByMaintainer} from './useUserProjects'

type UserProjectsOverviewProps=Readonly<{
  layout: ProjectLayoutType
  skeleton_items: number
  loading: boolean
  projects: ProjectByMaintainer[]
}>

export default function UserProjectsOverview({loading,skeleton_items,layout,projects}:UserProjectsOverviewProps) {

  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={skeleton_items} fullWidth={true} />
  }

  if (projects.length === 0) {
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
                <ProjectListItemContent key={item.id} {...item as any} />
              </OverviewListItem>
            </Link>
          )
        })}
      </ProjectOverviewList>
    )
  }

  // GRID as default
  // use software overview component for full width (4 items in row)
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
              {...item as any}
            />
          </Link>
        )
      })}
    </SoftwareOverviewGrid>
  )
}
