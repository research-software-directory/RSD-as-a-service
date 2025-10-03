// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
export default function ProjectOverviewList({children}: { children: JSX.Element | JSX.Element[]}) {
  return (
    <section
      data-testid="project-overview-list"
      className="flex-1 flex flex-col gap-2 mt-2 mb-12"
    >
      {children}
    </section>
  )
}
