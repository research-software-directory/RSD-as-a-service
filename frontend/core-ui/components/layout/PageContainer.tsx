// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'

export default function PageContainer({children,className}:{children:ReactNode,className?:string}) {
  return (
    <section
      className={`flex-1 lg:container lg:mx-auto ${className ? className : ''}`}
    >
      {children}
    </section>
  )
}
