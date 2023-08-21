// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

type OverviewListItemProps = {
  children: React.JSX.Element | React.JSX.Element[],
  className?: string
}

export default function OverviewListItem({
  children,
  className=''
}: OverviewListItemProps) {
  return (
    <div className={`flex-1 flex items-center transition shadow-sm border bg-base-100 rounded hover:shadow-lg ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
