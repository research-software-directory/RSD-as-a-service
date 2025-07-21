// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

type PaginationLinkProps={
  createUrl: (key: string, value: string | string[]) => string
  count?: number
  page?: number
  className?: string
}

export default function PaginationLink({createUrl,count,page,className}:PaginationLinkProps) {
  // do not show if no page count
  if (!count) return null

  return (
    <div className={`flex flex-wrap justify-center ${className ?? ''}`}>
      <Pagination
        count={count}
        page={page}
        renderItem={item => {
          if (item.disabled === false && item?.page) {
            return (
              <Link href={createUrl('page', item.page.toString())}>
                <PaginationItem {...item}/>
              </Link>
            )
          } else {
            return (
              <PaginationItem {...item}/>
            )
          }
        }}
      />
    </div>
  )
}
