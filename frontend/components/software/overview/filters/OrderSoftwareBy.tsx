// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import OrderBy from '~/components/filter/OrderBy'
import {highlightOrderOptions, softwareOrderOptions} from './softwareOrderOptions'

type OrderByProps = {
  orderBy: string
}

export function OrderHighlightsBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useHandleQueryChange()
  return (
    <OrderBy
      order={orderBy}
      options={highlightOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}

export default function OrderSoftwareBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useHandleQueryChange()
  return (
    <OrderBy
      order={orderBy}
      options={softwareOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
