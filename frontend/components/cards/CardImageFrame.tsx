// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

export default function CardImageFrame({children}:{children:React.JSX.Element}) {
  return (
    <div className="h-[37%] flex overflow-hidden relative bg-base-100">
      {children}
    </div>
  )
}
