// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import ProjectDuration from './ProjectDuration'
import {ProjectStatusKey} from '~/types/Project'

type ProjectPeriodProps = {
  date_start: string | null
  date_end: string | null
  project_status: ProjectStatusKey
}

export default function ProjectPeriod({date_start, date_end, project_status}: ProjectPeriodProps) {
  // if status unknown we do not show project period
  if (project_status==='unknown') return null

  // when project is finished we only show dates
  // if (project_status === 'finished') {
  //   return (
  //     <ProjectDuration
  //       date_start={date_start}
  //       date_end={date_end}
  //     />
  //   )
  // }

  // show both dates and progressbar
  return (
    <>
      <ProjectDuration
        date_start={date_start}
        date_end={date_end}
      />
      <PeriodProgressBar
        date_start={date_start}
        date_end={date_end}
        className="mt-[0.0625rem] rounded"
        height="0.375rem"
      />
    </>
  )
}
