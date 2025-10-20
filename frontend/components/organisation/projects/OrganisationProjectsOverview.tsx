// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {useUserSettings} from '~/config/UserSettingsContext'
import {ProjectOfOrganisation} from '~/types/Organisation'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import AdminProjectListItem from './list/AdminProjectListItem'
import AdminProjectGridCard from './card/AdminProjectGridCard'

type OrganisationProjectsOverviewProps = Readonly<{
  projects: ProjectOfOrganisation[]
  isMaintainer: boolean
}>

export default function OrganisationProjectsOverview({projects,isMaintainer}: OrganisationProjectsOverviewProps) {
  const {rsd_page_layout} = useUserSettings()

  // console.group('OrganisationProjectsOverview')
  // console.log('projects...',projects)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('isMaintainer...',isMaintainer)
  // console.groupEnd()

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (rsd_page_layout === 'list') {
    return (
      <ListOverviewSection>
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
              <OverviewListItemLink
                href={`/projects/${item.slug}`}
              >
                <ProjectListItemContent {...item} />
              </OverviewListItemLink>
            </OverviewListItem>
          )
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
  return (
    <GridOverview>
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
    </GridOverview>
  )
}
