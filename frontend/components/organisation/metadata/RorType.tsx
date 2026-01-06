// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TypeIcon from '~/components/icons/TypeIcon'

export default function RorType({ror_types}:Readonly<{ror_types:string[]|null}>) {

  if (ror_types === null) return null

  return (
    <>
      {ror_types.map(item => (
        <div key={item} className="flex gap-2">
          <TypeIcon />
          <span>{item}</span>
        </div>
      ))}
    </>

  )
}
