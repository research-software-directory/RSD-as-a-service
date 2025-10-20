// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSearchParams} from 'next/navigation'
import {useUserSettings} from '~/config/UserSettingsContext'

export default function useProjectParams() {
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
    project_status: searchParams?.get('project_status') ?? null,
    keywords_json: searchParams?.get('keywords') ?? null,
    domains_json: searchParams?.get('domains') ?? null,
    organisations_json: searchParams?.get('organisations') ?? null,
    categories_json: searchParams?.get('categories') ?? null
  }

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  function getFilterCount() {
    let count = 0
    if (params?.search) count++
    if (params?.project_status) count++
    if (params?.keywords_json) count++
    if (params?.domains_json) count++
    if (params?.organisations_json) count++
    if (params?.categories_json) count++
    return count
  }

  const filterCnt = getFilterCount()

  // console.group('useProjectParams')
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
