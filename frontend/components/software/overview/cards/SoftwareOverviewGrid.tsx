// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

export default function SoftwareOverviewGrid({children,fullWidth=false}: {
  children: JSX.Element | JSX.Element[], fullWidth?:boolean }) {
  // default
  let md=1,lg=2,xl=3
  // update number of items
  if (fullWidth===true){
    md=2
    lg=3
    xl=4
  }
  return (
    <section
      data-testid="software-overview-grid"
      className={`mt-4 grid gap-8 md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} auto-rows-[28rem]`}
    >
      {children}
    </section>
  )
}
