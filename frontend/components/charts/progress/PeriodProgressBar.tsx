// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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

  // if both of date values is missing we do not show the progress bar
  if (date_start === null && date_end === null) {
    return null
  }

  function getProgressValue({date_start, date_end}: PeriodProgressBar): number | null {
    const start_date = date_start === null ? null : new Date(date_start)
    const end_date = date_end === null ? null : new Date(date_end)
    if (start_date === null && end_date === null) {
      return null
    }

    const now = new Date()

    if (start_date === null) {
      return (end_date as Date) < now ? 100 : null
    }
    if (end_date === null) {
      return start_date > now ? 0 : null
    }

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
  if (progress === null) {
    return null
  }

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
