// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function SidebarTitle({children,className,title}:{children:any,className?:string,title?:string}) {
  return (
    <div
      title={title ?? ''}
      className={`text-primary pb-2 ${className ?? ''}`}>
      {children}
    </div>
  )
}
