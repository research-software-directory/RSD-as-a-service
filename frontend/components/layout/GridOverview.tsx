// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

type GridOverviewProps=Readonly<{
  children: JSX.Element | JSX.Element[]
  fullWidth?: boolean
  className?: string
}>

/**
 * Section element with variable grid layout.
 * It has default top margin (mt-2) and row height of 28rem (auto-rows-[28rem]).
 * Note! These values are overwritten when new className values are passed!
 * When fullWith is set to true xl breakpoint is added with 4 columns (xl:grid-cols-4).
 * @param param0
 * @returns
 */
export default function GridOverview({children,fullWidth=false,className='mt-2 auto-rows-[28rem]'}:GridOverviewProps) {
  // fullWidth adds 4 cols to grid
  if (fullWidth){
    return (
      <section
        data-testid="grid-overview-4"
        className={`flex-1 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      >
        {children}
      </section>
    )
  }
  // default is for grid with 3 cols next to filter panel
  return (
    <section
      data-testid="grid-overview-3"
      className={`flex-1 grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {children}
    </section>
  )
}
