// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {ssrBasicParams} from '~/utils/extractQueryParam'
import {QueryParams,buildFilterUrl} from '~/utils/postgrestUrl'
import {useUserSettings} from '~/config/UserSettingsContext'
import {RsdModuleName} from '~/config/rsdSettingsReducer'

/**
 * Hook to extract basic query parameters rows, page and search from the url.
 * This hook is used by organisation, news and communities overview.
 * @param view the route of the overview page (organisations | communities | news)
 * @returns handleQueryChange and resetFilters methods.
 */
export default function useSearchParams(view:RsdModuleName){
  const router = useRouter()
  const {rsd_page_rows, setPageRows} = useUserSettings()

  function createUrl(key: string, value: string | string[]) {
    const params: QueryParams = {
      // take existing params from url (query)
      // basic params are search, page and rows
      ...ssrBasicParams(router ? router.query : {}),
      // overwrite with new value
      [key]: value,
    }
    // on each param change we reset page
    if (key !== 'page') {
      params['page'] = 1
    }
    if (typeof params['rows'] === 'undefined' || params['rows'] === null) {
      // use value from user settings if none provided
      params['rows'] = rsd_page_rows
    }
    // construct url with all query params
    const url = buildFilterUrl(params,view)
    return url
  }

  function handleQueryChange(key: string, value: string | string[]) {
    const url = createUrl(key, value)

    if (key === 'rows'){
      // save number of rows in user settings (saves to cookie too)
      setPageRows(Number.parseInt(value.toString()))
    }
    if (key === 'page' && router) {
      // when changing page we scroll to top
      router.push(url, url, {scroll: true})
    } else if (router) {
      // update page url but keep scroll position
      router.push(url, url, {scroll: false})
    }
  }

  function resetFilters() {
    // remove params from url and keep scroll position
    if (router) router.push(router.pathname, router.pathname, {scroll: false})
  }

  return {
    handleQueryChange,
    resetFilters,
    createUrl
  }
}
