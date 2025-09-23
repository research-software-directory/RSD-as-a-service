// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {softwareOrderOptions} from '~/components/software/overview/filters/softwareOrderOptions'

export const adminOrderOptions = [
  {key: 'status', label: 'Blocked', direction: 'asc.nullslast'},
  {key: 'is_published', label: 'Not published', direction: 'asc.nullslast'},
]

export function getSoftwareOrderOptions(isMaintainer:boolean) {
  if (isMaintainer) {
    return [
      ...softwareOrderOptions,
      // additional organisation option (default order)
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOrderOptions
    ]
  }
  return [
    ...softwareOrderOptions,
    // additional organisation option (default order)
    {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'}
  ]
}

/**
 * Build organisation order postgREST query
 * @param isMaintainer
 * @param orderKey
 * @returns postgrest order string
 */
export function getOrganisationSoftwareOrder(isMaintainer:boolean, orderKey?:string|null){
  // default order is_featured (Pinned)
  if (!orderKey) orderKey = 'is_featured'

  // get all order options
  const orderOptions = getSoftwareOrderOptions(isMaintainer)

  if (orderKey){
    const orderInfo = orderOptions.find(item=>item.key===orderKey)
    if (orderInfo) return `${orderInfo.key}.${orderInfo.direction},slug.asc`
  }

  // last default
  return 'slug.asc'
}
