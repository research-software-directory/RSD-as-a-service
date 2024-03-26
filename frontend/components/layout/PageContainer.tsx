// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'

export default function PageContainer({children,className}:{children:ReactNode,className?:string}) {
  return (
    <section
      className={`lg:container lg:mx-auto ${className ? className : ''}`}
    >
      {children}
    </section>
  )
}
