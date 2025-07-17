// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
type OverviewListItemProps = {
  children: JSX.Element | JSX.Element[],
  className?: string
}

export default function OverviewListItem({
  children,
  className=''
}: OverviewListItemProps) {
  return (
    <div className={`flex items-center transition shadow-xs border bg-base-100 rounded-sm hover:shadow-lg ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
