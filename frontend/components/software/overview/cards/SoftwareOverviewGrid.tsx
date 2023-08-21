// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

export default function SoftwareOverviewGrid({children}: { children: JSX.Element | JSX.Element[] }) {
  return (
    <section
      data-testid="software-overview-grid"
      className="mt-4 grid gap-8 lg:grid-cols-2 xl:grid-cols-3 auto-rows-[28rem]"
    >
      {children}
    </section>
  )
}
