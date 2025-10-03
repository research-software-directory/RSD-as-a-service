// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSearchParams} from 'next/navigation'
import {useUserSettings} from '~/config/UserSettingsContext'

export default function useSoftwareParams() {
  const searchParams = useSearchParams()
  // get user preferences
  const {rsd_page_rows,rsd_page_layout} = useUserSettings()
  // use encoded array params as json string to avoid
  // useEffect re-renders in api hooks
  const params = {
    search: searchParams?.get('search') ?? null,
    order: searchParams?.get('order') ?? null,
    rows: searchParams?.has('rows') ? Number.parseInt(searchParams?.get('rows') as string) : rsd_page_rows,
    page: searchParams?.get('page') ? Number.parseInt(searchParams?.get('page') as string) : 1,
    prog_lang_json: searchParams?.get('prog_lang') ?? null,
    keywords_json: searchParams?.get('keywords') ?? null,
    licenses_json: searchParams?.get('licenses') ?? null,
    categories_json: searchParams?.get('categories') ?? null,
    rsd_host_json: searchParams?.get('rsd_host') ?? null
  }

  // default is grid
  const view = rsd_page_layout ?? 'grid'

  function getFilterCount() {
    let count = 0
    if (params?.search) count++
    if (params?.prog_lang_json) count++
    if (params?.keywords_json) count++
    if (params?.licenses_json) count++
    if (params?.categories_json) count++
    if (params?.rsd_host_json) count++
    return count
  }

  const filterCnt = getFilterCount()

  // console.group('useSoftwareParams')
  // console.log('params...', params)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.groupEnd()

  // return these
  return {
    ...params,
    filterCnt,
    view
  }
}
