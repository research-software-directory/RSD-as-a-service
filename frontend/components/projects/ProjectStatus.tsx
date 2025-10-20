// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {getMonthYearDate} from '~/utils/dateFn'
import {getProjectStatus} from '~/components/projects/apiProjects'
import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import SidebarTitle from '~/components/layout/SidebarTitle'
import ProjectSidebarSection from '../layout/SidebarSection'

type ProjectStatusProps = {
  date_start: string | null,
  date_end: string | null
}

export default function ProjectStatus({date_start, date_end}: ProjectStatusProps) {

  if (date_start === null && date_end === null) {
    return null
  }

  const status = getProjectStatus({
    date_start,
    date_end
  })

  return (
    <ProjectSidebarSection>
      <SidebarTitle>Status</SidebarTitle>
      <PeriodProgressBar
        date_start={date_start}
        date_end={date_end}
        className="mb-2 rounded-md"
      />
      <div className="flex justify-between text-sm">
        <span>{date_start ? getMonthYearDate(date_start) : 'N/A'}</span>
        <span>{date_end ? getMonthYearDate(date_end) : 'N/A'}</span>
      </div>
      <div className="py-2 text-sm text-center">{status}</div>
    </ProjectSidebarSection>
  )
}
