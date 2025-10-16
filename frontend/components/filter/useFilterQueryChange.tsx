// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback} from 'react'
import {useRouter} from 'next/router'

import {useUserSettings} from '~/config/UserSettingsContext'
import {encodeQueryValue} from '~/utils/extractQueryParam'
import {QueryParams} from '~/utils/postgrestUrl'

export default function useFilterQueryChange(){
  const router = useRouter()
  const {rsd_page_rows, setPageRows} = useUserSettings()

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
      params['rows'] = rsd_page_rows
    } else if (key === 'rows'){
      // save number of rows in user settings (saves to cookie too)
      setPageRows(Number.parseInt(value.toString()))
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
  }, [router,rsd_page_rows,setPageRows])

  return {
    handleQueryChange
  }
}
