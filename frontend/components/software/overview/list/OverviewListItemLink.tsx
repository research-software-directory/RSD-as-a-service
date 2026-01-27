// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import Link from 'next/link'

type OverviewListItemLinkProps=Readonly<{
  href: string
  children: JSX.Element | JSX.Element[],
  className?: string
  target?: string
  title?: string
}>

export default function OverviewListItemLink({href,children,className,...props}:OverviewListItemLinkProps) {
  return (
    <Link
      data-testid="overview-list-item-link"
      href={href}
      className={`flex-1 flex gap-2 items-center hover:text-inherit bg-base-100 rounded-xs ${className ?? ''}`}
      {...props}
    >
      {children}
    </Link>
  )
}
