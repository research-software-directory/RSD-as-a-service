// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectListItem} from '~/types/Project'
import ProjectGridCard from './cards/ProjectGridCard'

export default function SoftwareOverviewGrid({projects = []}: { projects: ProjectListItem[] }) {
  const grid={
    height: '30rem',
    minWidth: '18rem',
    maxWidth: '1fr'
  }

  return (
    <section
      data-testid="project-overview-grid"
      className="mt-4 grid gap-8 lg:grid-cols-2 xl:grid-cols-3 auto-rows-[30rem]"
    >
      {projects.map((item) => (
        <ProjectGridCard key={item.id} item={item}/>
      ))}
    </section>
  )
}
