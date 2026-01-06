// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

export type AuthHeader = {
  'Content-Type': string;
  Authorization?: string;
}


export function createJsonHeaders(token?: string): AuthHeader {
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return {
    'Content-Type': 'application/json'
  }
}

export async function extractReturnMessage(resp: Response, dataId?: string) {
  try{
    // OK
    if ([200, 201, 204, 206].includes(resp.status)) {
    // just return id
      return {
        status: 200,
        message: dataId ?? 'OK'
      }
    }
    // not authorized, 404 seem to be returned in some cases
    if ([401, 403, 404].includes(resp.status)) {
      return {
        status: resp.status,
        message: `
          ${resp.statusText}.
          You might not have sufficient privileges to edit this item.
          Please contact site administrators.
        `
      }
    }
    // extract custom PostgREST error message
    let errMsg: string|null = null
    if (resp.json) {
      const json = await resp.json()
      errMsg = json.message
    }
    if ([409].includes(resp.status)) {
      return {
        status: resp.status,
        message: `
          ${resp.statusText}:
          ${errMsg ?? 'duplicate key value violates unique constraint.'}
        `
      }
    }
    if (errMsg) {
      return {
        status: resp.status,
        message: errMsg
      }
    }
    return {
      status: resp.status,
      message: `
        ${resp.statusText}.
        Please contact site administrators.
      `
    }
  }catch(e:any){
    logger(`extractReturnMessage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: `Error extractReturnMessage: ${e.message}`
    }
  }
}

export function extractErrorMessages(responses: {status: number, message: string}[]) {
  const errors: {status: number, message: string}[] = []
  responses.forEach(resp => {
    if (resp.status !== 200) {
      errors.push(resp)
    }
  })
  return errors
}


type GrapQLResponse = {
  data?: any,
  errors?:any
}

export async function extractRespFromGraphQL(resp: Response) {
  const json: GrapQLResponse = await resp.json()
  if (json?.errors && json.errors.length > 0) {
    return {
      status: 500,
      message: json.errors[0]?.message ?? 'Unknown error'
    }
  }
  return {
    status: 200,
    data: json?.data ?? undefined
  }
}

export function getBaseUrl() {
  const baseUrl = process.env.POSTGREST_URL || '/api/v1'
  return baseUrl
}

export async function promiseWithTimeout<T>(
  promise:Promise<T>,
  timeout:number
):Promise<T>{
  const timeoutPromise = new Promise<T>((res,rej)=>{
    setTimeout(()=>{
      rej({
        status:408,
        statusText:'Request timeout'
      })
    },timeout*1000)
  })
  const resp = await Promise.race([
    promise,
    timeoutPromise
  ])
  // console.log('promiseWithTimeout...', resp)
  return resp
}

// Validate url string is syntactically correct
export function isProperUrl(url:string){
  try{
    new URL(url)
    return true
  }catch{
    return false
  }
}

type ComposeUrlType={
  slug:string
  route?:string|null
  domain?:string|null
}

/**
 * Compose url based on optionally provided values.
 * @param domain: provide domain including https://
 * @param route: optional route string
 * @param slug: required slug string
 * @returns domain + route + slug as string url
 */
export function composeUrl({domain,route,slug}:ComposeUrlType){
  try{
    let d, r, s
    // domain without ending /
    if (domain?.endsWith('/')){
      d = domain.slice(0,domain.length-1)
    } else {
      d = domain
    }
    // route without starting or ending /
    // remove
    if (route?.startsWith('/')) route = route.slice(1)
    if (route?.endsWith('/')){
      r = route.slice(0,route.length-1)
    }else{
      r = route
    }

    // slug without starting on ending /
    if (slug?.startsWith('/')) slug = slug.slice(1)
    if (slug?.endsWith('/')){
      s = slug.slice(0,slug.length-1)
    }else{
      s = slug
    }

    // compose url
    let url = ''
    if (d) url = d
    if (r) url += `/${r}`
    if (s) url += `/${s}`
    // return url
    return url
  }catch(e:any){
    logger(`composeUrl: ${e.message}`,'warn')
    return '/'
  }
}
