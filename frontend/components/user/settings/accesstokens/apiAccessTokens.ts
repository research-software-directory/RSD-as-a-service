// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type NewAccessToken = {
  display_name: string
  expires_at: string
}

export type AccessToken = NewAccessToken & {
  id: string
  created_at: string
}

export async function getUserAccessTokens({token}: {token: string}) {
  try {
    const url = getBaseUrl() + '/rpc/my_user_access_tokens?order=expires_at.asc'
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: AccessToken[] = await resp.json()
      return data
    }
    logger(`getUserAccessTokens not 200: ${resp.status} - ${resp.body}`, 'error')
    return []
  } catch (e: any) {
    logger(`getUserAccessTokens: ${e?.message}`, 'error')
    return []
  }
}

export async function createUserAccessToken({accesstoken, token}: {accesstoken: NewAccessToken, token: string}) {
  try {
    const url = '/auth/accesstoken'
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify(accesstoken)
    })
    if (resp.status === 201) {
      const data = await resp.json()
      const token_string: string = data['access_token']
      if (token_string) {
        return {
          status: 201,
          message: token_string
        }
      }
      return {
        status: 400,
        message: 'Token is missing'
      }
    }
    const text = await resp.text()
    return {status: resp.status, message: text}

  } catch (e: any) {
    logger(`createUserAccessToken: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteUserAccessToken({id, token}: {id: string, token: string}) {
  try {
    const url = getBaseUrl() + '/rpc/delete_my_user_access_token'

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({id: id})
    })

    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteRsdInvite: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
