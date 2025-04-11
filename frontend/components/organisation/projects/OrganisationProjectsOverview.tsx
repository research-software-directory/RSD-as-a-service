// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import AdminProjectGridCard from './card/AdminProjectGridCard'
import {ProjectOfOrganisation} from '~/types/Organisation'
import useOrganisationContext from '../context/useOrganisationContext'
import ProjectOverviewGrid from '~/components/projects/overview/cards/ProjectOverviewGrid'
import ProjectOverviewList from '~/components/projects/overview/list/ProjectOverviewList'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import AdminProjectListItem from './list/AdminProjectListItem'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import CardSkeleton from '~/components/cards/CardSkeleton'

type OrganisationProjectsOverviewProps = Readonly<{
  layout: ProjectLayoutType
  projects: ProjectOfOrganisation[]
  loading: boolean
  rows: number
}>

export default function OrganisationProjectsOverview({layout,projects,loading,rows}: OrganisationProjectsOverviewProps) {
  const {isMaintainer, project_cnt} = useOrganisationContext()
  // max item to be set to rows
  let itemCnt = rows
  if (project_cnt && project_cnt < rows) itemCnt = project_cnt

  // console.group('ProjectsOfOrganisation')
  // console.log('projects...',projects)
  // console.log('layout...', layout)
  // console.log('isMaintainer...',isMaintainer)
  // console.groupEnd()

  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={itemCnt} />
  }

  if (loading===false && (!projects || projects.length === 0)) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <ProjectOverviewList>
        {projects.map(item => {
          if (isMaintainer) {
            return (
              <AdminProjectListItem
                key={item.id}
                item={item}
              />
            )
          }
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
      {projects.map((item) => {
        if (isMaintainer) {
          return (
            <AdminProjectGridCard key={item.id} item={item} />
          )
        }
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
