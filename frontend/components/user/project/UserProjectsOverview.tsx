// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import CardSkeleton from '~/components/cards/CardSkeleton'
import StatusBanner from '~/components/cards/StatusBanner'
import {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
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
      <ListOverviewSection>
        {projects.map(item => {
          return (
            <OverviewListItem key={item.id}>
              <OverviewListItemLink
                href={`/projects/${item.slug}`}
              >
                <ProjectListItemContent
                  title={item.title}
                  subtitle={item.subtitle ?? ''}
                  image_id={item.image_id}
                  impact_cnt={item.impact_cnt}
                  output_cnt={item.output_cnt}
                  statusBanner={
                    // show not published status
                    item.is_published===false ?
                    <StatusBanner
                      status={'approved'}
                      is_featured={false}
                      is_published={item.is_published}
                      width='auto'
                      borderRadius='0.125rem'
                    />
                    :undefined
                  }
                />
              </OverviewListItemLink>
            </OverviewListItem>
          )
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
  // use software overview component for full width (4 items in row)
  return (
    <GridOverview fullWidth={true}>
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
    </GridOverview>
  )
}
