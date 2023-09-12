// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {getSoftwareParams} from '~/utils/extractQueryParam'
import {useUserSettings} from '../../context/UserSettingsContext'

export default function useSoftwareParams() {
  // initalise router
  const router = useRouter()
  // get user preferences
  const {rsd_page_rows} = useUserSettings()
  // extract project specific params
  // const params = ssrProjectsParams(router.query)
  // use encoded array params as json string to avoid
  // useEffect re-renders in api hooks
  const params = getSoftwareParams(router.query)

  if (typeof params.rows === 'undefined' && rsd_page_rows) {
    params.rows = rsd_page_rows
  }

  function getFilterCount() {
    let count = 0
    if (params?.keywords_json) count++
    if (params?.prog_lang_json) count++
    if (params?.licenses_json) count++
    if (params?.search) count++
    return count
  }

  const filterCnt = getFilterCount()

  // console.group('useSoftwareParams')
  // console.log('params...', params)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.groupEnd()
  // extract user prefference

  // return these
  return {
    ...params,
    filterCnt
  }
}
