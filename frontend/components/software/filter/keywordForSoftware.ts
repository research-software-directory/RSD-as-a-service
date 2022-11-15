// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Keyword} from '~/components/keyword/FindKeyword'
import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

// this is always frontend call
export async function findSoftwareWithKeyword(
  {searchFor}: { searchFor: string }
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)
    const baseUrl = getBaseUrl()
    // GET top 30 matches with count > 0
    const query = `keyword=ilike.*${searchForEncoded}*&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc&limit=30`
    const url = `${baseUrl}/rpc/keyword_count_for_software?${query}`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }

    // return extractReturnMessage(resp, project ?? '')
    logger(`findSoftwareWithKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`findSoftwareWithKeyword: ${e?.message}`, 'error')
    return []
  }
}
