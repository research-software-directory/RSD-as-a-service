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
  // extract error message
  const json: ApiErrorMsg = await resp.json()
  if ([409].includes(resp.status)) {
    return {
      status: resp.status,
      message: `
          ${resp.statusText}:
          ${json.message ?? 'duplicate key value violates unique constraint.'}
        `
    }
  }
  if (json.message) {
    return {
      status: resp.status,
      message: json.message
    }
  }
  return {
    status: resp.status,
    message: `
        Failed to save changes.
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
