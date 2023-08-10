// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import ProjectDuration from './ProjectDuration'
import {ProjectState} from '~/types/Project'

type ProjectPeriodProps = {
  date_start: string | null
  date_end: string | null
  project_state: ProjectState
}

export default function ProjectPeriod({date_start, date_end, project_state}: ProjectPeriodProps) {
  // if one of dates is missing we only show project_state
  if (!date_start || !date_end) {
    return (
      <div className="text-sm text-base-content-secondary">{project_state}</div>
    )
  }
  // when project is finished we only show dates
  if (project_state === 'Finished') {
    return (
      <ProjectDuration
        date_start={date_start}
        date_end={date_end}
      />
    )
  }
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
