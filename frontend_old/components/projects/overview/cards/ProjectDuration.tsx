// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getMonthYearDate} from '~/utils/dateFn'

type ProjectDurationProps = {
  date_start: string | null
  date_end: string | null
}

export default function ProjectDuration({date_start,date_end}:ProjectDurationProps) {
  return (
    <div className="text-sm text-base-content-secondary">
      <span>{date_start ? getMonthYearDate(date_start) : 'N/A'}</span>
      &nbsp;-&nbsp;
      <span>{date_end ? getMonthYearDate(date_end) : 'N/A'}</span>
    </div>
  )
}
