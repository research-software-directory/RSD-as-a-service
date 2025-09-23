// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useProjectOverviewParams from '../useProjectOverviewParams'
import OrderBy from '~/components/filter/OrderBy'
import {projectOrderOptions} from './projectOrderOptions'

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
