// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function SidebarPanel({children,className}:{children:any,className?:string}) {
  return (
    <aside className={`flex flex-col gap-8 ${className ?? ''}`}>
      {children}
    </aside>
  )
}
