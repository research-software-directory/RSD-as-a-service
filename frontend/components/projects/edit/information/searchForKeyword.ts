// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}


// this is always frontend call
export async function searchForProjectKeyword({searchFor}:
{searchFor: string}) {
  try {
    // GET top 30 matches
    const url = `/api/v1/rpc/keyword_count_for_projects?keyword=ilike.*${searchFor}*&order=cnt.desc.nullslast,keyword.asc&limit=30`
    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForProjectKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForProjectKeyword: ${e?.message}`, 'error')
    return []
  }
}
