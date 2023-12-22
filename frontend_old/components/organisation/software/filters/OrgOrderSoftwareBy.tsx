// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import OrderBy from '~/components/filter/OrderBy'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import useSoftwareParams from './useSoftwareParams'
import useSoftwareOrderOptions from './useSoftwareOrderOptions'

export default function OrgOrderProjectsBy() {
  const {order} = useSoftwareParams()
  const {handleQueryChange} = useQueryChange()
  const softwareOrderOptions = useSoftwareOrderOptions()

  // we load component only if there are options
  if (softwareOrderOptions.length > 0) {
    return (
      <OrderBy
        order={order ?? ''}
        options={softwareOrderOptions}
        handleQueryChange={handleQueryChange}
      />
    )
  }

  return null
}
