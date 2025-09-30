// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdUser} from '~/auth'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {KeywordForCommunity} from './settings/general/apiCommunityKeywords'
import {Community} from '../admin/communities/apiCommunities'
import {isCommunityMaintainer} from '~/auth/permissions/isMaintainerOfCommunity'

// New type based on Community but replace
// id with new type
export type CommunityListProps = Omit<Community,'id'> & {
  // id is always present
  id: string,
  // additional props
  software_cnt: number | null,
  pending_cnt: number | null,
  rejected_cnt: number | null,
  keywords: string[] | null
}

// New type based on CommunityListProps but replace
// the keywords type
export type EditCommunityProps = Omit<CommunityListProps,'keywords'> & {
  keywords: KeywordForCommunity[]
}


type GetCommunityListParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string|null,
  orderBy?:string,
}

export async function getCommunityList({page,rows,token,searchFor,orderBy}:GetCommunityListParams){
  try{
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      const encodedSearch = encodeURIComponent(searchFor)
      // search in name and short description
      query+=`&or=(name.ilike."*${encodedSearch}*",short_description.ilike."*${encodedSearch}*")`
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
    if (slug===null) return {
      community: null,
      isMaintainer:false
    }
    // get id from slug
    const com = await getCommunityIdFromSlug({slug,token})
    if (com===null) return {
      community: null,
      isMaintainer:false
    }
    // console.log('com...',com)
    // get info if the user is maintainer
    const isMaintainer = await isCommunityMaintainer({
      community: com.id,
      role: user?.role,
      account: user?.account,
      token
    })
    // console.log('isMaintainer...',isMaintainer)
    // filter on id value
    let query = `id=eq.${com.id}`
    if (isMaintainer===true) {
      //if user is maintainer of this community
      //we request the counts of all items
      query +='&public=false'
    }
    const url = `${getBaseUrl()}/rpc/communities_overview?${query}`
    // console.log('url...',url)
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
      return {
        community: json,
        isMaintainer
      }
    }
    // NOT FOUND
    logger(`getCommunityBySlug: ${resp.status}:${resp.statusText}`, 'warn')
    return {
      community: null,
      isMaintainer
    }
  }catch(e:any){
    logger(`getCommunityBySlug: ${e?.message}`, 'error')
    return {
      community: null,
      isMaintainer: false
    }
  }
}

export async function getCommunityIdFromSlug({slug,token}:{slug:string,token?:string}){
  try{
    // ignore if no slug
    if (slug===null) return null
    // filter on slug value
    const query = `slug=eq.${slug}`
    const url = `${getBaseUrl()}/community?select=id&${query}`

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
      const json:{id:string} = await resp.json()
      return json
    }
    // NOT FOUND
    logger(`getCommunityId: ${resp.status}:${resp.statusText}`, 'warn')
    return null
  }catch(e:any){
    logger(`getCommunityId: ${e?.message}`, 'error')
    return null
  }
}

type PatchCommunityProps = {
  id: string,
  data:{
    slug?: string,
    name?: string,
    short_description?: string | null,
    logo_id?: string | null
    description?: string | null
  },
  token: string
}

export async function patchCommunityTable({id, data, token}:PatchCommunityProps) {
  try {
    const url = `/api/v1/community?id=eq.${id}`
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
