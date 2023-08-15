// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {getProjectsParams} from '~/utils/extractQueryParam'
import {useUserSettings} from '../context/UserSettingsContext'

export default function useProjectParams() {
  // initalise router
  const router = useRouter()
  // get user preferences
  const {rsd_page_rows} = useUserSettings()
  // use encoded array params as json string to avoid
  // useEffect re-renders in api hooks
  const params = getProjectsParams(router.query)

  if (typeof params.rows === 'undefined' && rsd_page_rows) {
    params.rows = rsd_page_rows
  }

  // if (params.search==='') params.search = null

  function getFilterCount() {
    let count = 0
    if (params?.keywords_json) count++
    if (params?.domains_json) count++
    if (params?.organisations_json) count++
    if (params?.search) count++
    if (params?.project_status) count++
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
    filterCnt
  }
}
