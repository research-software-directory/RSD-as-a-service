// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import OrderBy from '~/components/filter/OrderBy'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import {softwareOrderOptions} from '~/components/software/overview/filters/softwareOrderOptions'
import {useCommunityContext} from '~/components/communities/context'

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
  let {order} = useSoftwareParams()
  const {handleQueryChange} = useHandleQueryChange()
  const orderOptions = getSoftwareOrderOptions(isMaintainer)

  const allowedOrderings = orderOptions.map(o => o.key)
  if (order === null || !allowedOrderings.includes(order)) {
    order = 'mention_cnt'
  }

  return (
    <OrderBy
      order={order}
      options={orderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
