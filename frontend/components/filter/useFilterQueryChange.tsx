// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {useRouter} from 'next/router'

import {rowsPerPageOptions} from '~/config/pagination'
import {encodeQueryValue} from '~/utils/extractQueryParam'
import {QueryParams} from '~/utils/postgrestUrl'
import {getDocumentCookie} from '~/utils/userSettings'


export default function useFilterQueryChange(){
  const router = useRouter()

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
      // console.group('useFilterQueryChange')
      // console.log('scroll...true')
      // console.groupEnd()
      // on page change we scroll to top
      router.push({query},undefined,{scroll: true})
    } else {
      // console.group('useFilterQueryChange')
      // console.log('scroll...false')
      // console.groupEnd()
      router.push({query},undefined,{scroll: false})
    }
  }, [router])

  return {
    handleQueryChange
  }
}
