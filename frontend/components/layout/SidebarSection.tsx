// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function SidebarSection({children,className}:{children:any,className?:string}) {

  if (className){
    return (
      <div className={`${className ?? ''}`}>
        {children}
      </div>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}
