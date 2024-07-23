// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import {softwareOrderOptions} from '~/components/software/overview/filters/OrderSoftwareBy'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import useSoftwareParams from './useSoftwareParams'

const adminOrderOptions = [
  {key: 'status', label: 'Blocked', direction: 'asc.nullslast'},
  {key: 'is_published', label: 'Not published', direction: 'asc.nullslast'},
]

export function getSoftwareOrderOptions(isMaintainer:boolean) {
  if (isMaintainer) {
    return [
      ...softwareOrderOptions,
      // additional organisation option (should be default)
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOrderOptions
    ]
  } else {
    return [
      ...softwareOrderOptions,
      // additional organisation option (should be default)
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'}
    ]
  }
}


export default function OrgOrderSoftwareBy() {
  const {isMaintainer} = useOrganisationContext()
  let {order} = useSoftwareParams()
  const orderOptions = getSoftwareOrderOptions(isMaintainer)
  const {handleQueryChange} = useQueryChange()

  const allowedOrderKeys = orderOptions.map(o => o.key)
  if (order === null || !allowedOrderKeys.includes(order)) {
    order = 'is_featured'
  }

  return (
    <OrderBy
      order={order}
      options={orderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
