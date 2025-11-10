// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {type NextRequest} from 'next/server'
import {parse} from 'cookie'

import logger from '~/utils/logger'
import {createSession} from '~/auth/getSessionServerSide'

/**
 * GET api/fe/token/refresh
 * Refresh token before expires. This route is used by frontend auth module to refresh token.
 */
export async function GET(request: NextRequest){
  const rsdTokenCookieKey = 'rsd_token'
  try{
    const rsdTokenValue = request.cookies.get(rsdTokenCookieKey)?.value

    const url = `${process.env.RSD_AUTH_URL}/refresh`

    // make request and pass cookies
    const resp = await fetch(url, {
      headers: {
        Cookie: `${rsdTokenCookieKey}=${rsdTokenValue}`
      }
    })

    // console.group('api/fe/token/refresh')
    // console.log('url...', url)
    // console.log('cookie...', cookie)
    // console.log('status...', resp.status)
    // console.log('text...', resp.statusText)
    // console.groupEnd()

    if (resp.status === 200) {
      // extract cookie from response header
      const raw_cookies = resp.headers.get('set-cookie')
      let rsd_token = null
      if (raw_cookies) {
        rsd_token = parse(raw_cookies)?.rsd_token
      }
      if (rsd_token && raw_cookies) {
        const session = await createSession(rsd_token)
        if (session.status === 'authenticated') {
          // pass set-cookie header received to our response
          return Response.json({session},{
            headers:{
              'set-cookie':raw_cookies
            }
          })
        }
        // else just return session
        return Response.json({session})
      }
      // remove old/invalid/expired cookie
      return Response.json({message:'Token not received'},{
        status: 400,
        statusText: 'Token not received',
        headers: {
          // remove rsd_token cookie using max-age=0
          'set-cookie': 'rsd_token=deleted;Max-Age=0;Secure; HttpOnly; Path=/; SameSite=Lax;'
        }
      })
    }

    // ELSE: remove old/invalid/expired cookie
    logger(`api/fe/token/refresh: ${resp.status} - ${resp.statusText}`, 'error')

    // proxy response from auth
    return Response.json({
      status: resp.status,
      message:resp.statusText,
      cookie: rsdTokenValue,
    },{
      status: resp.status,
      statusText: resp.statusText,
      headers: {
        // remove rsd_token cookie using max-age=0S
        'set-cookie': 'rsd_token=deleted;Max-Age=0;Secure; HttpOnly; Path=/; SameSite=Lax;'
      }
    })

  }catch(e:any){
    logger(`api/fe/token/refresh:" ${e?.message}`, 'error')
    return Response.json({message:e?.message ?? 'Unknown server error'},{
      status: 500,
      statusText: e?.message ?? 'Unknown server error',
      headers: {
        // remove rsd_token cookie using max-age=0
        'set-cookie': 'rsd_token=deleted;Max-Age=0;Secure; HttpOnly; Path=/; SameSite=Lax;'
      }
    })
  }
}
