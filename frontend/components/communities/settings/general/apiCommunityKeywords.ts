// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export type CommunityKeyword = {
  community: string
  keyword: string
}

export type KeywordForCommunity = {
  id: string
  community: string
  keyword: string
}

/**
 * Loading community keywords for editing
 * @param uuid
 * @param token
 * @returns
 */
export async function getKeywordsByCommunity(uuid:string,token?:string){
  try{
    const query = `rpc/keywords_by_community?community=eq.${uuid}&order=keyword.asc`
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data:KeywordForCommunity[] = await resp.json()
      return data
    }
    logger(`getKeywordsByCommunity ${resp.status} ${resp.statusText}`,'warn')
    return []
  }catch(e:any){
    logger(`getKeywordsByCommunity: ${e?.message}`,'error')
    return []
  }
}

export async function addKeywordsToCommunity({data, token}:
{data: CommunityKeyword | CommunityKeyword[], token: string}) {
  try {
    // POST
    const url = '/api/v1/keyword_for_community'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addKeywordsToCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteKeywordFromCommunity({community, keyword, token}:
{community: string, keyword: string, token: string}) {
  try {
    // DELETE record based on community and keyword uuid
    const query = `keyword_for_community?community=eq.${community}&keyword=eq.${keyword}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, community ?? '')
  } catch (e: any) {
    logger(`deleteKeywordFromCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
