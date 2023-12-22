// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type OverviewListItemProps = {
  children: JSX.Element | JSX.Element[],
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
