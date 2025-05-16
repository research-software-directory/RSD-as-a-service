// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getSoftwareParams} from '~/utils/extractQueryParam'

export default function useSoftwareParams() {
  // initialise router
  const router = useRouter()
  // get user preferences
  const {rsd_page_rows,rsd_page_layout,setPageLayout} = useUserSettings()
  // use encoded array params as json string to avoid
  // useEffect re-renders in api hooks
  const params = getSoftwareParams(router.query)

  if (typeof params.rows === 'undefined' && rsd_page_rows) {
    params.rows = rsd_page_rows
  }

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  function getFilterCount() {
    let count = 0
    if (params?.keywords_json) count++
    if (params?.prog_lang_json) count++
    if (params?.licenses_json) count++
    if (params?.categories_json) count++
    if (params?.search) count++
    return count
  }

  const filterCnt = getFilterCount()

  // console.group('useSoftwareParams')
  // console.log('params...', params)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.groupEnd()

  // return params & count
  return {
    ...params,
    filterCnt,
    view,
    setPageLayout
  }
}
