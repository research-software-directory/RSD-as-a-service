// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import ProjectDuration from './ProjectDuration'

type ProjectPeriodProps = {
  date_start: string | null
  date_end: string | null
}

export default function ProjectPeriod({date_start, date_end}: ProjectPeriodProps) {
  // if both dates are missing we do not show project period
  if (!date_start && !date_end) return null

  // show both dates and progressbar
  return (
    <div style={{width: '150px'}}>
      <ProjectDuration
        date_start={date_start}
        date_end={date_end}
      />
      <PeriodProgressBar
        date_start={date_start}
        date_end={date_end}
        className="mt-[0.0625rem] rounded-sm"
        height="0.375rem"
      />
    </div>
  )
}
