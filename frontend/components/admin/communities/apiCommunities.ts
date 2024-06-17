// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type Community={
  id?:string,
  slug:string,
  name:string,
  short_description: string|null,
  description: string|null,
  primary_maintainer: string|null,
  logo_id: string|null
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

