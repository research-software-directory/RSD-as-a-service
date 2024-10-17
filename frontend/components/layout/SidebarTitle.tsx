// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function SidebarTitle({children,className}:{children:any,className?:string}) {
  return (
    <div className={`text-primary pb-2 ${className ?? ''}`}>
      {children}
    </div>
  )
}
