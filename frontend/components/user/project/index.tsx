// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import ProjectOverviewList from '~/components/projects/overview/list/ProjectOverviewList'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import useUserProjects from './useUserProjects'

export default function UserProjects() {
  const {loading, projects} = useUserProjects()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  if (projects.length===0){
    return <NoContent />
  }

  return (
    <div>
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
    </div>
  )
}
