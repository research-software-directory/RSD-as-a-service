// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Keyword} from '~/components/keyword/FindKeyword'
import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

// this is always frontend call
export async function searchForKeyword(
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
    logger(`searchForKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForKeyword: ${e?.message}`, 'error')
    return []
  }
}

export type ProgramminLanguage = {
  prog_lang: string
  cnt: number
}

// this is always frontend call
export async function searchForProgrammingLanguage({searchFor}:
  { searchFor: string }) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)
    const baseUrl = getBaseUrl()
    // GET top 30 matches WITH count > 0
    const query = `prog_lang=ilike.*${searchForEncoded}*&cnt=gt.0&order=cnt.desc.nullslast,prog_lang.asc&limit=30`
    const url = `${baseUrl}/rpc/prog_lang_cnt_for_software?${query}`
    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: ProgramminLanguage[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForProgrammingLanguage: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForProgrammingLanguage: ${e?.message}`, 'error')
    return []
  }
}

