// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useSmallScreen from '~/config/useSmallScreen'

/**
 * Filters panel for tablet and desktop.
 * Note! On mobile (smallScreen) this panel is hidden.
 * @param param0
 * @returns
 */
export default function FiltersPanel({children}: {children: any}) {
  const smallScreen = useSmallScreen()

  // hide filter panel on mobile
  if (smallScreen) return null

  return (
    <div
      data-testid="filters-panel"
      className="flex bg-base-100 p-4 shadow-sm rounded-md flex-col gap-8 min-w-[18rem]">
      {children}
    </div>
  )
}
