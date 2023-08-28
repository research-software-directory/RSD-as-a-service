// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {scaleTime} from 'd3'

type PeriodProgressBar = {
  date_start: string | null,
  date_end: string | null
  className?: string
  height?:string
}

export default function PeriodProgressBar({date_start,date_end,className, height='0.5rem'}:PeriodProgressBar) {

  // if one of date values is missing we do not show progressbar
  if (date_start === null || date_end === null) return null

  function getProgressValue({date_start, date_end}: PeriodProgressBar) {
    if (date_start === null || date_end === null) return 0

    const start_date = new Date(date_start)
    const end_date = new Date(date_end)
    const now = new Date()

    // define x scale as time scale
    // from 0 - 100 so we convert is to %
    const xScale = scaleTime()
      .domain([start_date, end_date])
      .range([0,100])

    const progress = xScale(now)

    if (progress > 100) return 100
    if (progress < 0) return 0
    return Math.floor(progress)
  }

  const progress = getProgressValue({
    date_start,
    date_end
  })

  return (
    <div
      title={`${progress}%`}
      className={`w-full bg-base-300 overflow-hidden relative ${className}`}>
      <div
        data-testid="progress-bar-value"
        className="bg-primary"
        style={{width: `${progress}%`, height}}
      />
    </div>
  )
}
