// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import OrderBy from '~/components/filter/OrderBy'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import {projectOrderOptions} from './projectOrderOptions'

type OrderByProps = {
  orderBy: string
}

export default function OrderProjectsBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useHandleQueryChange()

  return (
    <OrderBy
      order={orderBy}
      options={projectOrderOptions}
      handleQueryChange={handleQueryChange}
    />
  )
}
