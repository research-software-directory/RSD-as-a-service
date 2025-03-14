// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'

export default function CategoryStatus({category}:Readonly<{category:CategoryEntry}>){
  switch(category.status){
    case 'pending':
      return (
        <span
          title = "Pending approval"
          className='bg-warning text-warning-content py-1 px-2 uppercase text-sm'
        >
          pending
        </span>
      )
    case 'rejected':
    case 'rejected_by_origin':
    case 'rejected_by_relation':
      return <span className='bg-error text-warning-content py-1 px-2 uppercase text-sm'>rejected</span>
    default:
      return null
  }
}
