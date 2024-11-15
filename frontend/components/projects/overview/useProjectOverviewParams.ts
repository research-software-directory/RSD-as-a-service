// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {QueryParams, ssrProjectsUrl} from '~/utils/postgrestUrl'
import {useUserSettings} from '~/config/UserSettingsContext'

export default function useProjectOverviewParams() {
  const router = useRouter()
  const {rsd_page_rows, setPageRows} = useUserSettings()

  function createUrl(key: string, value: string | string[]) {
    const params: QueryParams = {
      // take existing params from url (query)
      ...ssrProjectsParams(router.query),
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
    // construct and encode url with all query params
    const url = ssrProjectsUrl(params)
    return url
  }

  function handleQueryChange(key: string, value: string | string[]) {
    const url = createUrl(key, value)
    if (key === 'rows'){
      // save number of rows in user settings (saves to cookie too)
      setPageRows(parseInt(value.toString()))
    }
    // debugger
    if (key === 'page') {
      // when changing page we scroll to top
      router.push(url, url, {scroll: true})
    } else {
      // update page url but keep scroll position
      router.push(url, url, {scroll: false})
    }
  }

  function resetFilters() {
    // remove params from url, but keep order and scroll position
    const order = router.query['order'] ?? 'impact_cnt'
    const url = `${router.pathname}?order=${order}`
    router.push(url, url, {scroll: false})
  }

  return {
    handleQueryChange,
    resetFilters,
    createUrl
  }
}
