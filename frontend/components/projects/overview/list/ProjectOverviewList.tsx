// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectListItem} from '~/types/Project'
import ProjectOverviewListItem from './ProjectOverviewListItem'

export default function ProjectOverviewList({projects = []}: { projects: ProjectListItem[] }) {
  return (
    <section
      data-testid="project-overview-list"
      className="flex-1 mt-2"
    >
      {projects.map(item => <ProjectOverviewListItem key={item.id} item={item}/>)}
    </section>
  )
}
