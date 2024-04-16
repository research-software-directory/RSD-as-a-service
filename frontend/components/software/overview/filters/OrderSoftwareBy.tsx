// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import OrderBy from '~/components/filter/OrderBy'

export const softwareOrderOptions = [
  {key: 'contributor_cnt', label: 'Contributors', direction:'desc.nullslast'},
  {key: 'mention_cnt', label: 'Mentions', direction:'desc.nullslast'},
  {key: 'brand_name', label: 'Name', direction: 'asc.nullslast'},
]

export const highlightOrderOptions = [
  {key: 'position', label: 'Featured latest', direction: 'asc.nullslast'},
  {key: 'contributor_cnt', label: 'Contributors', direction:'desc.nullslast'},
  {key: 'mention_cnt', label: 'Mentions', direction:'desc.nullslast'},
  {key: 'brand_name', label: 'Name', direction: 'asc.nullslast'},
]

type OrderByProps = {
  orderBy: string
}

export function OrderHighlightsBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
  return (
    <OrderBy
      order={orderBy}
      options={highlightOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
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
