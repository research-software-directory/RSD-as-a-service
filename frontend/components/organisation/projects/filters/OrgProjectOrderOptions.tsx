// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {projectOrderOptions} from '~/components/projects/overview/filters/projectOrderOptions'
import {adminOrderOptions} from '../../software/filters/OrgSoftwareOrderOptions'


export function getProjectOrderOptions(isMaintainer:boolean) {
  // if maintainer additional order options are added
  if (isMaintainer) {
    return [
      ...projectOrderOptions,
      // organisation specific option
      {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
      ...adminOrderOptions
    ]
  }
  return [
    ...projectOrderOptions,
    // organisation specific option
    {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
  ]
}

/**
 * Build organisation order postgREST query
 * @param isMaintainer
 * @param orderKey
 * @returns postgrest order string
 */
export function getOrganisationProjectsOrder(isMaintainer:boolean, orderKey?:string|null){
  // default order is_featured (Pinned)
  if (!orderKey) orderKey = 'is_featured'

  // get all order options
  const orderOptions = getProjectOrderOptions(isMaintainer)

  if (orderKey){
    const orderInfo = orderOptions.find(item=>item.key===orderKey)
    if (orderInfo) return `${orderInfo.key}.${orderInfo.direction},slug.asc`
  }

  // last default
  return 'slug.asc'
}
