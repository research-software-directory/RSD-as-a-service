// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {scaleTime} from 'd3'
import {getMonthYearDate} from '../../utils/dateFn'
import {getProjectStatus} from '../../utils/getProjects'

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
  // default is 0 = Starting
  let progress = 0

  if (status === 'Finished') {
    progress = 100
  }

  function getProgressValue({date_start, date_end}: ProjectStatusProps) {
    if (date_start === null || date_end === null) return 0
    const start_date = new Date(date_start)
    const end_date = new Date(date_end)
    // define x scale as time scale
    // from 0 - 100 so we convert is to %
    const xScale = scaleTime()
      .domain([start_date, end_date])
      .range([0,100])

    const progress = xScale(new Date())
    if (progress > 100) return 100
    return Math.floor(progress)
  }

  if (status === 'Running' && date_start && date_end) {
    progress = getProgressValue({
      date_start,
      date_end
    })
  }

  return (
    <div>
      <div className="text-primary pb-4">Status</div>
      <div className="mb-2 w-full h-2 bg-base-300 rounded-md overflow-hidden relative">
        <div
          data-testid="progress-bar-value"
          className="bg-primary h-2"
          style={{width: `${progress}%`}} />
      </div>
      <div className="flex justify-between text-sm">
        <span>{getMonthYearDate(date_start)}</span>
        <span>{getMonthYearDate(date_end)}</span>
      </div>
      <div className="py-2 text-sm text-center">{status}</div>
    </div>
  )
}
