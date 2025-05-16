// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getProjectsParams} from '~/utils/extractQueryParam'

export default function useProjectParams() {
  // initialise router
  const router = useRouter()
  // get user preferences
  const {rsd_page_rows,rsd_page_layout,setPageLayout} = useUserSettings()
  // use encoded array params as json string to avoid
  // useEffect re-renders in api hooks
  const params = getProjectsParams(router.query)

  if (typeof params.rows === 'undefined' && rsd_page_rows) {
    params.rows = rsd_page_rows
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
    view,
    setPageLayout
  }
}
