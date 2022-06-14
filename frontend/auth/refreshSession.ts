// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '.'
import logger from '../utils/logger'

/**
 * Refresh session by calling node api refresh endpoint.
 * It is called from frontend and enables the token refresh and
 * the cookie update. This approach is required because the cookie is httponly,
 * and the token validation requires a secret key (only available on the server).
 */
export async function refreshSession(): Promise<Session | null> {
  try {
    const url = '/api/fe/token/refresh'
    const resp = await fetch(url)

    // console.group('refreshSession')
    // console.log('url...', url)
    // console.log('status...', resp.status)
    // console.log('text...', resp.statusText)
    // console.groupEnd()

    if (resp.status === 200) {
      const data = await resp.json()
      if (data?.session) {
        return data.session
      }
      return null
    } else {
      logger(`refreshSession failed:" ${resp.statusText}`, 'error')
      return null
    }
  } catch (e: any) {
    logger(`refreshSession failed:" ${e?.message}`, 'error')
    return null
  }
}

export default refreshSession
