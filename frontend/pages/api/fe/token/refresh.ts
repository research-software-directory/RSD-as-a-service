// Obtain refresh token from RSD auth service
import type {NextApiRequest, NextApiResponse} from 'next'
import cookie from 'cookie'
import {createSession, Session} from '../../../../auth'
import logger from '../../../../utils/logger'

type Data = {
  session:Session
}
type ErrMessage = {
  message: string
}

/**
 * Remove old rsd_token cookie from response.
 * By setting max-age value to 0
 * @param res
 */
function removeRsdTokenCookie(res: NextApiResponse) {
  // console.log('remove old/invalid/expired cookie...')
  res.setHeader(
    'Set-Cookie', ['rsd_token=deleted;Max-Age=0;Secure; HttpOnly; Path=/; SameSite=Lax;']
  )
}

/**
 *  Refresh JWT by calling auth/refresh service
 * @param req
 * @param res
 * @returns
 */
export default async function RefreshToken(
  req: NextApiRequest,
  res: NextApiResponse<Data|ErrMessage>
) {
  // res.status(200).json({module: 'frontend/api', version: 'v1', status: 'live'})
  // include cookie
  try {
    // extract cookie to send
    const cookies = req.headers.cookie!
    const url = `${process.env.RSD_AUTH_URL}/refresh`
    // make request and pass cookies
    const resp = await fetch(url, {
      headers: {
        cookie:cookies
      }
    })

    // console.group('api/fe/token/refresh')
    // console.log('url...', url)
    // console.log('status...', resp.status)
    // console.log('text...', resp.statusText)
    // console.groupEnd()

    if (resp.status === 200) {
      // extract cookie from response header
      const raw_cookies = resp.headers.get('set-cookie')
      let rsd_token = null
      if (raw_cookies) {
        rsd_token = cookie.parse(raw_cookies)?.rsd_token
      }
      if (rsd_token && raw_cookies) {
        const session = createSession(rsd_token)
        if (session.status === 'authenticated') {
          // replace old cookie in out reponse to FE
          res.setHeader('set-cookie',raw_cookies)
        }
        return res.status(200).json({session})
      }
      // remove old/invalid/expired cookie
      removeRsdTokenCookie(res)
      return res.status(400).json({message:'Token not received'})
    }
    // ELSE: remove old/invalid/expired cookie
    removeRsdTokenCookie(res)
    logger(`api/fe/token/refresh:" ${resp.statusText}`, 'error')
    // proxy response from auth
    return res.status(resp.status).json({message: resp.statusText})
  } catch (e: any) {
    // remove old/invalid/expired cookie
    removeRsdTokenCookie(res)
    logger(`api/fe/token/refresh:" ${e?.message}`, 'error')
    return res.status(500).json({message: e?.message})
  }
}
