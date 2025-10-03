// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useQueryChange from '../useQueryChange'
import useProjectParams from '../../../projects/overview/useProjectParams'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import {getProjectOrderOptions} from './OrgProjectOrderOptions'


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
