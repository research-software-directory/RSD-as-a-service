// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function FiltersPanel({children}: { children: any }) {
  return (
    <div
      data-testid="filters-panel"
      className="flex bg-base-100 p-4 shadow-sm rounded-md flex-col gap-8 min-w-[18rem]">
      {children}
    </div>
  )
}
