// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {useRouter} from 'next/router'

import useFilterQueryChange from '~/components/filter/useFilterQueryChange'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'

export default function useQueryChange() {
  const router = useRouter()
  const {handleQueryChange} = useFilterQueryChange()

  // console.group('useQueryChange')
  // console.log('hook called...')
  // console.groupEnd()

  const resetFilters = useCallback((tab: TabKey) => {
    // use basic params
    const query: any = {
      slug: router.query.slug,
      tab
    }
    // keep order param if we are on same tab
    if (router.query['order'] && tab === router.query['tab']) {
      query['order'] = router.query['order']
    }
    router.push({query},undefined,{scroll: false})
  },[router])

  return {
    handleQueryChange,
    resetFilters
  }
}
