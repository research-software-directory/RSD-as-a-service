// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useQueryChange from '../useQueryChange'
import useProjectParams from '../useProjectParams'
import {projectOrderOptions} from '~/components/projects/overview/filters/OrderProjectsBy'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'

// additional admin options
export const adminOptions = [
  {key: 'status', label: 'Blocked', direction: 'asc.nullslast'},
  {key: 'is_published', label: 'Not published', direction:'asc.nullslast'}
]

export function getProjectOrderOptions(isMaintainer:boolean) {
  // if maintainer additional order options are added
  if (isMaintainer) {
    return [
      ...projectOrderOptions,
      // organisation specific option
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOptions
    ]
  } else {
    return [
      ...projectOrderOptions,
      // organisation specific option
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
    ]
  }
}


export default function OrgOrderProjectsBy() {
  const {isMaintainer} = useOrganisationContext()
  let {order} = useProjectParams()
  const orderOptions = getProjectOrderOptions(isMaintainer)
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
