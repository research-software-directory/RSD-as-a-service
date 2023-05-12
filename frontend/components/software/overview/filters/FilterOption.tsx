// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes} from 'react'

type FilterOptionProps = {
  props: HTMLAttributes<HTMLLIElement>,
  label: string,
  count: number
}

export default function FilterOption({props,label,count}:FilterOptionProps) {
  return (
    <li className="flex w-full items-center content-between" {...props} >
      <div className="text-sm flex-1">
        {label}
      </div>
      <div className="text-xs opacity-70">
        ({count})
      </div>
    </li>
  )
}
