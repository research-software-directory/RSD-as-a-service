// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {ApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'

export type RsdInfo = {
  key: string,
  value: string,
  public?: boolean,
  created_at?: string,
  updated_at?: string
}

export type RsdInfoTable = {
  id: string,
  key: string,
  value: string,
  public?: boolean,
  created_at?: string,
  updated_at?: string
  origin?: string
  command?: string
}

export async function getRsdInfo({page, rows, token, searchFor, orderBy}: ApiParams<RsdInfo, keyof RsdInfo>) {
  try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(key.ilike."*${searchFor}*",value.ilike."*${searchFor}*")`
    }
    if (orderBy) {
      query+=`&order=${orderBy.column}.${orderBy.direction}`
    } else {
      query+='&order=key.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rsd_info?${query}`

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
      const data: RsdInfo[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        rsdInfo: data.map(item=>({
          ...item,
          id: item.key,
          origin: 'rsd_info'
        }))
      }
    }
    logger(`getRsdInfo: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      rsdInfo: []
    }
  } catch (e: any) {
    logger(`getRsdInfo: ${e.message}`,'error')
    return {
      count: 0,
      rsdInfo: []
    }
  }
}

export async function createInfo({data,token}: {data:RsdInfo,token: string}) {
  try {
    // POST
    const url = `${getBaseUrl()}/rsd_info`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data)
    })
    if (resp.status === 201) {
      const json:RsdInfo[] = await resp.json()
      return {
        status: 201,
        message: json[0]
      }
    }
    // debugger
    return extractReturnMessage(resp, data.key ?? '')
  } catch (e: any) {
    logger(`createInfo: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchRsdInfo({id, key, value, token}: {id:string, key: string, value:any, token: string}) {
  try {
    const url = `${getBaseUrl()}/rsd_info?key=eq.${id}`
    // make request
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify({
        [key]:value
      })
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`patchRsdInfo: ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deleteInfoByKey({key, token}: {key: string, token: string}) {
  try {
    // try to find keyword
    const url = `${getBaseUrl()}/rsd_info?key=eq.${key}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, key)
  } catch (e: any) {
    logger(`deleteInfoByKey: ${e?.message}`, 'warn')
    return {
      status: 500,
      message: e?.message
    }
  }
}
