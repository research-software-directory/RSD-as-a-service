// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import ProjectDuration from './ProjectDuration'

type ProjectPeriodProps = {
  date_start: string | null
  date_end: string | null
}

export default function ProjectPeriod({date_start,date_end}:ProjectPeriodProps) {
  if (!date_start || !date_end) return null
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
