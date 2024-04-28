// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type Community={
  id?:string,
  slug:string,
  name:string,
  short_description: string|null,
  description: string|null,
  primary_maintainer: string|null,
  logo_id: string|null
}

type GetCommunitiesParams={
  page: number,
  rows: number,
  token: string
  searchFor?:string,
  orderBy?:string,
}

export async function getCommunities({page, rows, token, searchFor, orderBy}:GetCommunitiesParams){
  try{
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&name=ilike.*${searchFor}*`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=name.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/community?${query}`

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
      const communities: Community[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        communities
      }
    }
    logger(`getCommunities: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      communities: []
    }
  }catch(e:any){
    logger(`getCommunities: ${e.message}`,'error')
    return {
      count: 0,
      communities: []
    }
  }
}

export async function validCommunitySlug({slug, token}: { slug: string, token: string }) {
  try{
    // use server side when available
    const baseUrl = getBaseUrl()
    // get community by slug
    let query = `community?select=slug&slug=eq.${slug}`
    const url = `${baseUrl}/${query}`
    // get community
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status === 200) {
      const json: [] = await resp.json()
      return json.length > 0
    }
    return false
  }catch(e:any){
    logger(`validCommunitySlug: ${e?.message}`, 'error')
    return false
  }
}

export async function addCommunity({data,token}:{data:Community,token:string}) {
  try {
    const query = 'community'
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    })
    if (resp.status === 201) {
      const json = await resp.json()
      // return created page
      return {
        status: 200,
        message: json[0]
      }
    } else {
      return extractReturnMessage(resp, '')
    }
  } catch (e: any) {
    logger(`addCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteCommunityById({id,token}:{id:string,token:string}) {
  try {
    const query = `community?id=eq.${id}`
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`deleteCommunityById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

