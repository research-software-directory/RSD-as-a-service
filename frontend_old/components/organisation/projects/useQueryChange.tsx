// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {useRouter} from 'next/router'

import {rowsPerPageOptions} from '~/config/pagination'
import {encodeQueryValue} from '~/utils/extractQueryParam'
import {QueryParams} from '~/utils/postgrestUrl'
import {getDocumentCookie} from '~/utils/userSettings'
import {TabKey} from '../tabs/OrganisationTabItems'

export default function useQueryChange() {
  const router = useRouter()

  // console.group('useQueryChange')
  // console.log('hook called...')
  // console.groupEnd()

  const handleQueryChange = useCallback((key: string, value: string | string[]) => {
    const params: QueryParams = {
      [key]: encodeQueryValue(value),
    }
    // on each param change we reset page
    if (key !== 'page') {
      params['page'] = 1
    }
    if (typeof params['rows'] === 'undefined' || params['rows'] === null) {
      // extract from cookie or use default
      params['rows'] = getDocumentCookie('rsd_page_rows', rowsPerPageOptions[0])
    }

    // update query parameters
    const query:any = {
      ...router.query,
      ...params
    }

    if (value === '' || value === null || typeof value === 'undefined') {
      // remove query param
      delete query[key]
    }

    // construct url with all query params
    if (key === 'page') {
      // console.group('useQueryChange')
      // console.log('scroll...true')
      // console.groupEnd()
      // on page change we scroll to top
      router.push({query},undefined,{scroll: true})
    } else {
      // console.group('useQueryChange')
      // console.log('scroll...false')
      // console.groupEnd()
      router.push({query},undefined,{scroll: false})
    }
  }, [router])

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
