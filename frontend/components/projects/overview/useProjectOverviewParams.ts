// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {rowsPerPageOptions} from '~/config/pagination'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {QueryParams, ssrProjectsUrl} from '~/utils/postgrestUrl'
import {getDocumentCookie} from '~/utils/userSettings'


export default function useProjectOverviewParams() {
  const router = useRouter()

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
      // extract from cookie or use default
      params['rows'] = getDocumentCookie('rsd_page_rows', rowsPerPageOptions[0])
    }
    // construct url with all query params
    const url = ssrProjectsUrl(params)
    return url
  }

  function handleQueryChange(key: string, value: string | string[]) {
    const url = createUrl(key, value)
    // debugger
    if (key === 'page') {
      // when changin page we scroll to top
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
