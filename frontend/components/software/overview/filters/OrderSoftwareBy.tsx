// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import OrderBy from '~/components/filter/OrderBy'

export const softwareOrderOptions = [
  {key: 'contributor_cnt', label: 'Contributors', direction:'desc.nullslast'},
  {key: 'mention_cnt', label: 'Mentions', direction:'desc.nullslast'},
  {key: 'brand_name', label: 'Name', direction: 'asc'},
  {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
]

type OrderByProps = {
  orderBy: string
}

export default function OrderSoftwareBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
  return (
    <OrderBy
      order={orderBy}
      options={softwareOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
