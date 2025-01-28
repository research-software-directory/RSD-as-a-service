// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
export default function CardContentFrame({children}:{children:JSX.Element[]}) {
  return (
    <div className="h-[66%] flex flex-col p-4 relative">
      {children}
    </div>
  )
}
