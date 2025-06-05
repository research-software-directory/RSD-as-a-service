// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type EditRemoteRsd={
  id: string
  label: string,
  domain: string,
  active: boolean,
  scrape_interval_minutes: number
}

export type RemoteRsd = EditRemoteRsd & {
  scraped_at: string | null
  last_err_msg: string | null
  created_at: string
  updated_at: string
}

export type NewRemoteRsd=Omit<EditRemoteRsd,'id'>

type GetRemoteRsdParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string,
  orderBy?:string,
}
export async function getRemoteRsd({page,rows,token,searchFor,orderBy}:GetRemoteRsdParams){
  try{
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      // search in name and short description
      query+=`&or=(label.ilike."*${searchFor}*",domain.ilike."*${searchFor}*")`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=label.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/remote_rsd?${query}`

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
      const remoteRsd: RemoteRsd[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        remoteRsd
      }
    }
    logger(`getRemoteRsd: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      remoteRsd: []
    }
  }catch(e:any){
    logger(`getRemoteRsd: ${e?.message}`, 'error')
    return {
      count: 0,
      remoteRsd: []
    }
  }
}

export async function addRemoteRsd({data,token}:{data:NewRemoteRsd,token:string}){
  try{
    const url = `${getBaseUrl()}/remote_rsd`

    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // 'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, '')

  }catch(e:any){
    logger(`addRemoteRsd: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchRemoteRsd({id,data,token}:{id:string,data:Partial<EditRemoteRsd>,token:string}){
  try{
    const query = `remote_rsd?id=eq.${id}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url,{
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        // 'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, '')

  }catch(e:any){
    logger(`patchRemoteRsd: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteRemoteRsdById({id,token}:{id:string,token:string}){
  try{
    const url = `${getBaseUrl()}/remote_rsd?id=eq.${id}`

    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, '')
  }catch(e:any){
    logger(`deleteRemoteRsdById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteRemoteSoftwareByRemoteRsdId({id,token}:{id:string,token:string}){
  try{
    const url = `${getBaseUrl()}/remote_software?remote_rsd_id=eq.${id}`

    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    return extractReturnMessage(resp, '')
  }catch(e:any){
    logger(`deleteRemoteSoftwareByRemoteRsdId: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function isValidRemoteRsdUrl(domain:string){
  try{
    const url = `${domain}/api/v1/rpc/software_overview?limit=1&offset=0`
    // basic request
    const resp = await fetch(url,{
      // wait max. of 5 seconds
      signal: AbortSignal.timeout(5000)
    })

    if (resp.ok){
      return true
    }
    return false
  }catch(e:any){
    logger(`isValidRemoteRsdUrl: ${e?.message}`, 'error')
    return false
  }
}

export async function getRemoteName(domain:string){
  try{
    const url = `${domain}/api/v1/rsd_info?key=eq.remote_name`
    // basic request
    const resp = await fetch(url,{
      // wait max. of 5 seconds
      signal: AbortSignal.timeout(5000)
    })
    if (resp.ok){
      const data = await resp.json()
      if (data[0]?.['value']){
        return data[0]?.['value']
      }
      return null
    }
    return null
  }catch(e:any){
    logger(`getRemoteName: ${e?.message}`, 'error')
    return null
  }
}
