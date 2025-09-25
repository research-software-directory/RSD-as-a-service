// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {isOrcid} from '~/utils/getORCID'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {ProjectListItem} from '~/types/Project'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'

function getOrcidOrAccountQuery(orcid:string|null,account:string|null){
  if (orcid && account){
    return `or=(orcid.eq.${orcid},account.eq.${account})`
  } else if (orcid){
    return `orcid=eq.${orcid}`
  } else if (account) {
    return `account=eq.${account}`
  }else{
    return null
  }
}

type ProfileRpcQuery = {
  orcid: string | null
  account: string | null
  rows: number
  page: number
  search?: string|null,
  token?: string
}

export async function getProfileSoftware({orcid,account,rows=12,page=0,search,token}:ProfileRpcQuery) {
  try {
    const offset = page * rows
    // filter on orcid, account or both if present
    let query = getOrcidOrAccountQuery(orcid,account)
    // if ORCID and account MISSING
    if (query===null) return null
    // order by mention count first
    query += `&order=mention_cnt.desc.nullslast,contributor_cnt.desc.nullslast,id&limit=${rows}&offset=${offset}`
    // include search
    if (search){
      const encodedSearch = encodeURIComponent(search)
      query+=`&or=(brand_name.ilike."*${encodedSearch}*",short_statement.ilike."*${encodedSearch}*",keywords_text.ilike."*${encodedSearch}*")`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/software_by_public_profile?${query}`
    // console.log('getProfileSoftware...url...', url)
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
      const software: SoftwareOverviewItemProps[] = await resp.json()
      return {
        software_cnt: extractCountFromHeader(resp.headers) ?? 0,
        software
      }
    }
    logger(`getProfileSoftware: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      software_cnt:0,
      software:[]
    }
  } catch (e: any) {
    logger(`getProfileSoftware: ${e.message}`,'error')
    return {
      software_cnt:0,
      software:[]
    }
  }
}

export async function getProfileProjects({orcid,account,rows=12,page=0,search,token}:ProfileRpcQuery) {
  try {
    const offset = page * rows
    // filter on orcid, account or both if present
    let query = getOrcidOrAccountQuery(orcid,account)
    // if ORCID and account MISSING
    if (query===null) return null
    // order by impact_cnt first
    query += `&order=impact_cnt.desc.nullslast,output_cnt.desc.nullslast,id&limit=${rows}&offset=${offset}`
    // include search
    if (search){
      const encodedSearch = encodeURIComponent(search)
      query+=`&or=(title.ilike.*${encodedSearch}*,subtitle.ilike.*${encodedSearch}*,keywords_text.ilike.*${encodedSearch}*)`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/project_by_public_profile?${query}`
    // console.log('getProfileProjects...url...', url)
    // console.log('getProfileProjects...search...', search)
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
      const projects: ProjectListItem[] = await resp.json()
      return {
        project_cnt: extractCountFromHeader(resp.headers) ?? 0,
        projects
      }
    }
    logger(`getProfileProjects: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      project_cnt: 0,
      projects:[]
    }
  } catch (e: any) {
    logger(`getProfileProjects: ${e.message}`,'error')
    return {
      project_cnt: 0,
      projects:[]
    }
  }
}

export function parsePersonId(id:string){
  let account:string|null = null
  let orcid:string|null = null
  // ID can be ORCID or account id
  if (isOrcid(id)){
    orcid = id
  } else {
    account = id
  }
  return {
    account,
    orcid
  }
}
