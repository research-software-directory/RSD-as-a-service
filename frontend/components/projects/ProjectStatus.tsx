// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {getMonthYearDate} from '~/utils/dateFn'
import {getProjectStatus} from '~/utils/getProjects'
import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'

type ProjectStatusProps = {
  date_start: string | null,
  date_end: string | null
}

export default function ProjectStatus({date_start, date_end}: ProjectStatusProps) {

  if (date_start === null || date_end === null) return null

  const status = getProjectStatus({
    date_start,
    date_end
  })

  return (
    <div>
      <div className="text-primary pb-4">Status</div>
      <PeriodProgressBar
        date_start={date_start}
        date_end={date_end}
        className="mb-2 rounded-md"
      />
      <div className="flex justify-between text-sm">
        <span>{getMonthYearDate(date_start)}</span>
        <span>{getMonthYearDate(date_end)}</span>
      </div>
      <div className="py-2 text-sm text-center">{status}</div>
    </div>
  )
}
