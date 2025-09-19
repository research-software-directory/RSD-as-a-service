// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

import {TabKey} from '../../tabs/CommunityTabItems'

export default function useResetFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const resetFilters = useCallback((tab: TabKey) => {
    // use tab param only
    let url = `${pathname}?tab=${tab}`

    // keep order if we are on same tab
    const order = searchParams?.get('order')
    const currentTab = searchParams?.get('tab')
    if ( order && tab === currentTab) {
      url+=`&order=${order}`
    }

    router.push(url,{scroll: false})

  },[router,pathname,searchParams])

  return {
    resetFilters
  }
}
