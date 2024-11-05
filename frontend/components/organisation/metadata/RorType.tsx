// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RORItem} from '~/utils/getROR'
import TypeIcon from '~/components/icons/TypeIcon'

export default function RorType({meta}:{meta:RORItem|null}) {
  try {
    if (meta === null) return null

    return (
      <>
        {meta.types.map(item => (
          <div key={item} className="flex gap-2">
            <TypeIcon />
            <span>{item}</span>
          </div>
        ))}
      </>

    )
  } catch {
    return null
  }
}
