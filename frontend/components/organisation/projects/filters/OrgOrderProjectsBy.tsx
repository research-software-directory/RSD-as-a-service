// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useQueryChange from '../useQueryChange'
import useProjectParams from '../useProjectParams'
import useProjectOrderOptions from './useProjectOrderOptions'

export default function OrgOrderProjectsBy() {
  const {order} = useProjectParams()
  const {handleQueryChange} = useQueryChange()
  const orderOptions = useProjectOrderOptions()

  // we load component only if there are options
  if (orderOptions.length > 0) {
    return (
      <OrderBy
        order={order ?? ''}
        options={orderOptions}
        handleQueryChange={handleQueryChange}
      />
    )
  }

  return null

}
