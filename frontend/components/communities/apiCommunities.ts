// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdUser} from '~/auth'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type CommunityListProps = {
  id: string,
  slug: string,
  name: string,
  short_description: string | null,
  logo_id: string | null
  software_cnt: number | null
}

type GetCommunityListParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string,
  orderBy?:string,
}

export async function getCommunityList({page,rows,token,searchFor,orderBy}:GetCommunityListParams){
  try{
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      // search in name and short description
      query+=`&or=(name.ilike.*${searchFor}*,short_description.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=name.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/communities_overview?${query}`

    // get community
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200,206].includes(resp.status)) {
      const communities: CommunityListProps[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        communities
      }
    }
    logger(`getCommunityList: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      communities: []
    }
  }catch(e:any){
    logger(`getCommunityList: ${e.message}`,'error')
    return {
      count: 0,
      communities: []
    }
  }
}

type GetCommunityBySlug={
  slug: string|null,
  user: RsdUser|null,
  token?:string
}

export async function getCommunityBySlug({slug,user,token}:GetCommunityBySlug){
  try{
    // ignore if no slug
    if (slug===null) return null
    // filter on slug value
    const query = `slug=eq.${slug}`
    const url = `${getBaseUrl()}/rpc/communities_overview?${query}`

    // get community
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request single record
        'Accept': 'application/vnd.pgrst.object+json'
      }
    })

    if (resp.status === 200) {
      const json:CommunityListProps = await resp.json()
      return json
    }
    // NOT FOUND
    logger(`getCommunityBySlug: ${resp.status}:${resp.statusText}`, 'warn')
    return null
  }catch(e:any){
    logger(`getCommunityBySlug: ${e?.message}`, 'error')
    return null
  }
}


type PatchCommunityProps = {
  id: string,
  slug?: string,
  name?: string,
  short_description?: string | null,
  logo_id?: string | null
  description?: string | null
}

export async function patchCommunity({data, token}:
  { data: PatchCommunityProps, token: string }) {
  try {
    const url = `/api/v1/community?id=eq.${data.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}
