// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from './search/ViewToggleGroup'
import ProjectOverviewGrid from './ProjectOverviewGrid'
import ProjectOverviewList from './list/ProjectOverviewList'
import {ProjectListItem} from '~/types/Project'

type SoftwareOverviewContentProps = {
  layout: ProjectLayoutType
  projects:ProjectListItem[]
}

export default function SoftwareOverviewContent({layout, projects}: SoftwareOverviewContentProps) {

  if (!projects || projects.length === 0) {
    return <NoContent />
  }

  if (layout === 'grid') {
    return (
      <ProjectOverviewGrid
        projects={projects}
      />
    )
  }

  // LIST overview as default
  return (
    <ProjectOverviewList
      projects={projects}
    />
  )
}
