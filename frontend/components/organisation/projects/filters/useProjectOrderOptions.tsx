// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {OrderOption} from '~/components/filter/OrderBy'
import {projectOrderOptions} from '~/components/projects/overview/filters/OrderProjectsBy'
import useOrganisationContext from '../../context/useOrganisationContext'

// additional admin options
export const adminOptions = [
  {key: 'status', label: 'Blocked', direction: 'asc.nullslast'},
  {key: 'is_featured', label: 'Pinned', direction: 'desc.nullslast'},
  {key: 'is_published', label: 'Not published', direction:'asc.nullslast'}
]

export function getProjectOrderOptions(isMaintainer:boolean) {
  if (isMaintainer) {
    const order = [
      ...projectOrderOptions,
      ...adminOptions
    ]
    return order
  } else {
    return projectOrderOptions
  }
}

export default function useProjectOrderOptions() {
  const {isMaintainer} = useOrganisationContext()
  const [orderOptions, setOrderOptions] = useState<OrderOption[]>([])

  useEffect(() => {
    // if maintainer additional order options are added
    if (isMaintainer === true) {
      const orderOptions = [
        ...projectOrderOptions,
        ...adminOptions
      ]
      setOrderOptions(orderOptions)
    } else {
      setOrderOptions(projectOrderOptions)
    }
  },[isMaintainer])

  return orderOptions

}
