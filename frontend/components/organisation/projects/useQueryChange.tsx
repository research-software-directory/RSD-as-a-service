// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback} from 'react'
import {useRouter,usePathname,useSearchParams} from 'next/navigation'

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'

export default function useQueryChange() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {handleQueryChange} = useHandleQueryChange()

  // console.group('useQueryChange')
  // console.log('pathname...',pathname)
  // console.log('searchParams...',searchParams)
  // console.groupEnd()

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
    handleQueryChange,
    resetFilters
  }
}
