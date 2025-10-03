// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'
import {usePathname,useSearchParams} from 'next/navigation'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

type PaginationLinkProps=Readonly<{
  count?: number
  page?: number
  className?: string
}>

export default function PaginationLinkApp({count,page,className}:PaginationLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // do not show if no page count
  if (!count) return null

  // start with existing searchParams
  const urlParams = new URLSearchParams(searchParams ?? '')

  return (
    <div className={`flex flex-wrap justify-center ${className ?? ''}`}>
      <Pagination
        count={count}
        page={page}
        renderItem={item => {
          if (item.disabled === false && item?.page) {
            // set page param for this url
            urlParams.set('page',item.page.toString())
            const url = `${pathname}?${urlParams.toString()}`
            return (
              <Link href={url}>
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
