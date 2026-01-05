// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'

import {paginationUrlParams} from '~/utils/postgrestUrl'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'

type getKeywordApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: string
}

export type KeywordCount = {
  id: string,
  keyword: string,
  software_cnt: number,
  projects_cnt: number
}

export async function getKeywords({page, rows, token, searchFor, orderBy}: getKeywordApiParams) {
  try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&keyword=ilike.*${searchFor}*`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=keyword.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/keyword_cnt?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const keywords: KeywordCount[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        keywords
      }
    }
    logger(`getKeywords: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      keywords: []
    }
  } catch (e: any) {
    logger(`getKeywords: ${e.message}`,'error')
    return {
      count: 0,
      keywords: []
    }
  }
}

export async function patchKeyword({id, value, token}: {id: string, value: string, token: string}) {
  try {
    const query = `id=eq.${id}`
    const url = `${getBaseUrl()}/keyword?${query}`

    // make request
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify({
        value
      })
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`patchKeyword: ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deleteKeywordById({id, token}: {id: string, token: string}) {
  try {
    // try to find keyword
    const url = `/api/v1/keyword?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`deleteKeywordById: ${e?.message}`, 'warn')
    return {
      status: 500,
      message: e?.message
    }
  }
}


