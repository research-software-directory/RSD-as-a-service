// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes} from 'react'

type FilterOptionProps = {
  props: HTMLAttributes<HTMLLIElement>,
  label: string,
  count: number,
  capitalize?: boolean
}

export default function FilterOption({label,count,capitalize=true,props}:FilterOptionProps) {
  // console.group('FilterOption')
  // console.log('label...', label)
  // console.log('props...', props)
  // console.groupEnd()
  return (
    <li className="flex w-full items-center content-between" {...props}>
      <div className={`text-sm flex-1 ${capitalize ? 'capitalize' :''}`}>
        {label}
      </div>
      <div className="text-xs opacity-70">
        ({count})
      </div>
    </li>
  )
}
