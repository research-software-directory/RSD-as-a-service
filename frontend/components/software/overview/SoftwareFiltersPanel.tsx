// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function SoftwareFiltersPanel({children}: { children: any }) {
  return (
    <div className="flex bg-base-100 p-4 shadow rounded-md flex-col gap-8 w-[17rem]">
      {children}
    </div>
  )
}
