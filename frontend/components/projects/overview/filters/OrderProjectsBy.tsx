// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useProjectOverviewParams from '../useProjectOverviewParams'
import OrderBy from '~/components/filter/OrderBy'

export const projectOrderOptions = [
  {key: 'impact_cnt', label: 'Impact', direction:'desc.nullslast'},
  {key: 'output_cnt', label: 'Output', direction: 'desc.nullslast'},
  {key: 'date_start', label: 'Start date', direction: 'desc.nullslast'},
  {key: 'date_end', label: 'End date', direction: 'asc.nullslast'},
  {key: 'title', label: 'Title', direction: 'asc.nullslast'}
]

type OrderByProps = {
  orderBy: string
}

export default function OrderProjectsBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useProjectOverviewParams()

  return (
    <OrderBy
      order={orderBy}
      options={projectOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
