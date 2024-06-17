// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import {softwareOrderOptions} from '~/components/software/overview/filters/OrderSoftwareBy'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'
import {useCommunityContext} from '../../context'

const adminOrderOptions = [
  {key: 'is_published', label: 'Not published', direction: 'asc.nullslast'},
]

export function getSoftwareOrderOptions(isMaintainer:boolean) {
  if (isMaintainer) {
    const order = [
      ...softwareOrderOptions,
      ...adminOrderOptions
    ]
    return order
  } else {
    return softwareOrderOptions
  }
}

export default function OrderCommunitySoftwareBy() {
  const {isMaintainer} = useCommunityContext()
  const {order} = useSoftwareParams()
  const {handleQueryChange} = useFilterQueryChange()
  const orderOptions = getSoftwareOrderOptions(isMaintainer)

  return (
    <OrderBy
      order={order ?? ''}
      options={orderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
