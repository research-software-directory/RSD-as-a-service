// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Keyword} from '~/components/keyword/FindKeyword'
import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '../../../../utils/logger'


// this is always frontend call
export async function searchForSoftwareKeyword(
  {searchFor}: { searchFor: string }
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)
    const baseUrl = getBaseUrl()
    // GET top 30 matches
    const url = `${baseUrl}/rpc/keyword_count_for_software?keyword=ilike.*${searchForEncoded}*&order=cnt.desc.nullslast,keyword.asc&limit=30`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }

    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForSoftwareKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForSoftwareKeyword: ${e?.message}`, 'error')
    return []
  }
}

export async function searchForSoftwareKeywordExact(
  {searchFor}: { searchFor: string }
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)

    // GET top 50 matches
    const url = `/api/v1/rpc/keyword_count_for_software?keyword=eq.${searchForEncoded}&limit=1`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }

    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForSoftwareKeywordExact: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForSoftwareKeywordExact: ${e?.message}`, 'error')
    return []
  }
}
