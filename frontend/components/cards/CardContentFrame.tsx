// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

export default function CardContentFrame({children}:{children:React.JSX.Element[]}) {
  return (
    <div className="h-[63%] flex flex-col p-4 relative">
      {children}
    </div>
  )
}
