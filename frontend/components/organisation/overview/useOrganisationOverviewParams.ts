// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {rowsPerPageOptions} from '~/config/pagination'
import {ssrOrganisationParams} from '~/utils/extractQueryParam'
import {QueryParams, ssrOrganisationUrl} from '~/utils/postgrestUrl'
import {getDocumentCookie} from '~/components/software/overview/userSettings'


export default function useOrganisationOverviewParams() {
  const router = useRouter()

  function handleQueryChange(key: string, value: string | string[]) {
    const params: QueryParams = {
      // take existing params from url (query)
      ...ssrOrganisationParams(router.query),
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
    const url = ssrOrganisationUrl(params)
    if (key === 'page') {
      // when changin page we scroll to top
      router.push(url, url, {scroll: true})
    } else {
      // update page url but keep scroll position
      router.push(url, url, {scroll: false})
    }
  }

  function resetFilters() {
    // remove params from url and keep scroll position
    router.push(router.pathname, router.pathname, {scroll: false})
  }

  return {
    handleQueryChange,
    resetFilters
  }
}
