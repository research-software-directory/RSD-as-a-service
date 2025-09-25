// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

type UseResetFiltersProps={
  key: string
  default: string
}

export default function useResetFilters(orderFilter:UseResetFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const resetFilters = useCallback(() => {
    // remove params from url, but keep order and scroll position
    const order = searchParams?.get(orderFilter.key) ?? orderFilter.default
    const url = `${pathname}?order=${order}`
    router.push(url, {scroll: false})

  },[router,pathname,searchParams,orderFilter.key,orderFilter.default])

  return {
    resetFilters
  }
}
