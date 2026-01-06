// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {Keyword} from '~/components/keyword/FindKeyword'
import {getBaseUrl} from '~/utils/fetchHelpers'


// this is always frontend call
export async function searchForCommunityKeyword(
  {searchFor}: {searchFor: string}
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)
    const baseUrl = getBaseUrl()
    let query = ''
    if (searchForEncoded) {
      query = `keyword=ilike.*${searchForEncoded}*&order=cnt.desc.nullslast,keyword.asc&limit=30`
    } else {
      query = 'order=cnt.desc.nullslast,keyword.asc&limit=30'
    }
    // GET top 30 matches
    const url = `${baseUrl}/rpc/keyword_count_for_community?${query}`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }
    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForCommunityKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForCommunityKeyword: ${e?.message}`, 'error')
    return []
  }
}

