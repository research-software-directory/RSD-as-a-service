// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type AuthHeader = {
  'Content-Type': string;
  Authorization?: string;
}

export type ApiErrorMsg = {
  'hint': string | null
  'details': string | null
  'code': string
  'message': string
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
          You might not have sufficient priveleges to edit this item.
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
}

export function extractErrorMessages(responses: { status: number, message: string }[]) {
  let errors: { status: number, message: string }[] = []
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
