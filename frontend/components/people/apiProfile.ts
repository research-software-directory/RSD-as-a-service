// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {ProjectListItem} from '~/types/Project'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {RsdContributor} from '~/components/admin/rsd-contributors/useContributors'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'

type PersonProfilesProps={
  orcid: string
  token?: string
}

export async function getPersonProfiles({orcid, token}: PersonProfilesProps) {
  try {
    if (!orcid) return null
    // filter on orcid, order by image first
    const query = `orcid=eq.${orcid}&order=avatar_id.nullslast`

    // complete url
    const url = `${getBaseUrl()}/rpc/person_mentions?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if ([200,206].includes(resp.status)) {
      const profiles: RsdContributor[] = await resp.json()
      return profiles
    }
    logger(`getPersonProfiles: ${resp.status}: ${resp.statusText}`,'warn')
    return null
  } catch (e: any) {
    logger(`getPersonProfiles: ${e.message}`,'error')
    return null
  }
}

type ProfileRpcQuery = {
  orcid: string
  rows: number
  page: number
  search?: string,
  token?: string
}

export async function getProfileSoftware({orcid,rows=12,page=0,search,token}:ProfileRpcQuery) {
  try {
    if (!orcid) return null
    const offset = page * rows
    // filter on orcid, order by mention count first
    let query = `orcid=cs.%7B${orcid}%7D&order=mention_cnt.desc,contributor_cnt.desc,id&limit=${rows}&offset=${offset}`
    // include search
    if (search){
      const encodedSearch = encodeURIComponent(search)
      query+=`&or=(brand_name.ilike.*${encodedSearch}*,short_statement.ilike.*${encodedSearch}*,keywords_text.ilike.*${encodedSearch}*)`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/software_by_orcid?${query}`
    // console.log("getProfileSoftware...url...", url)
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

export async function getProfileProjects({orcid,rows=12,page=0,search,token}:ProfileRpcQuery) {
  try {
    if (!orcid) return null
    const offset = page * rows
    // filter on orcid, order by impact_cnt first
    let query = `orcid=cs.%7B${orcid}%7D&order=impact_cnt.desc,output_cnt.desc,id&limit=${rows}&offset=${offset}`
    // include search
    if (search){
      const encodedSearch = encodeURIComponent(search)
      query+=`&or=(title.ilike.*${encodedSearch}*,subtitle.ilike.*${encodedSearch}*,keywords_text.ilike.*${encodedSearch}*)`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/project_by_orcid?${query}`
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
