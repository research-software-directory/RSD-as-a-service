// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

type ListOverviewSectionProps=Readonly<{
  children: JSX.Element | JSX.Element[]
  className?: string
}>

export default function ListOverviewSection({children, className='mt-2'}:ListOverviewSectionProps) {
  return (
    <section
      data-testid="list-overview"
      className={`flex-1 flex flex-col gap-2 ${className}`}
    >
      {children}
    </section>
  )
}
