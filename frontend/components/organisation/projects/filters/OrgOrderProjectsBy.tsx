// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
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
    const order = [
      ...projectOrderOptions,
      // organisation specific option
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOptions
    ]
    return order
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
  const {order} = useProjectParams()
  const orderOptions = getProjectOrderOptions(isMaintainer)
  const {handleQueryChange} = useQueryChange()

  return (
    <OrderBy
      order={order ?? ''}
      options={orderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
