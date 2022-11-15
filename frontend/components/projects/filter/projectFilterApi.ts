// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {Keyword} from '../edit/information/searchForKeyword'

export type ResearchDomain = {
  id: string,
  key: string,
  name: string,
  cnt: number | null
}

// this is always frontend call
export async function searchForResearchDomain({searchFor}:
  { searchFor: string }) {
  try {
    // GET top 30 matches WITH count > 0
    const query = `or=(key.ilike.*${searchFor}*,name.ilike.*${searchFor}*)&cnt=gt.0&order=cnt.desc.nullslast,name.asc&limit=30`
    const url = `/api/v1/rpc/research_domain_count_for_projects?${query}`
    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: ResearchDomain[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForResearchDomain: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForResearchDomain: ${e?.message}`, 'error')
    return []
  }
}

export async function getResearchDomainInfo(keys:string[]) {
  try {
    // ignore when keys not provided
    if (typeof keys === 'undefined' || keys === null) return []
    // GET research domains info by key
    const query=`key=in.("${keys.join('","')}")`
    const url = `${getBaseUrl()}/rpc/research_domain_count_for_projects?${query}`
    // console.log('getResearchDomainInfo...', url)
    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: ResearchDomain[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    logger(`getResearchDomainInfo: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getResearchDomainInfo: ${e?.message}`, 'error')
    return []
  }
}

// this is always frontend call
export async function searchForKeyword({searchFor}:
  { searchFor: string }) {
  try {
    // GET top 30 matches with count > 0
    const query = `keyword=ilike.*${searchFor}*&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc&limit=30`
    const url = `/api/v1/rpc/keyword_count_for_projects?${query}`
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
    logger(`searchForKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForKeyword: ${e?.message}`, 'error')
    return []
  }
}
