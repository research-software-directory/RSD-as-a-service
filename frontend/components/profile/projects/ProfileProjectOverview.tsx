// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {ProjectListItem} from '~/types/Project'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'

type ProfileProjectOverviewProps = Readonly<{
  projects: ProjectListItem[]
}>

export default function ProfileProjectOverview({projects}:ProfileProjectOverviewProps) {
  const {rsd_page_layout} = useUserSettings()

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (rsd_page_layout === 'list') {
    return (
      <ListOverviewSection>
        {projects.map(item => {
          return (
            <OverviewListItem key={item.id} className='pr-4'>
              <OverviewListItemLink
                href={`/projects/${item.slug}`}
              >
                <ProjectListItemContent key={item.id} {...item} />
              </OverviewListItemLink>
            </OverviewListItem>
          )
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
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
              {...item}
            />
          </Link>
        )
      })}
    </GridOverview>
  )
}
