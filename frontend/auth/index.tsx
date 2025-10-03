// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Dispatch, SetStateAction} from 'react'
import {IncomingMessage, OutgoingMessage} from 'http'
import {parse} from 'cookie'
import logger from '~/utils/logger'
import verifyJwt, {decodeJwt} from './jwtUtils'


// refresh schedule margin 5min. before expiration time
// REFRESH_MARGIN_MSEC env variable is used for test purposes ONLY
const testMargin = process.env.REFRESH_MARGIN_MSEC ? Number.parseInt(process.env.REFRESH_MARGIN_MSEC) : undefined
export const REFRESH_MARGIN = testMargin ?? 5 * 60 * 1000
export type RsdRole = 'rsd_admin' | 'rsd_user'
export type RsdUserData = {
  [property: string]: string[]
}
export type RsdUser = {
  iss: 'rsd_auth'
  role: RsdRole
  // expiration time
  exp: number
  // uid
  account: string
  // display name
  name: string,
  data?: RsdUserData,
}

export type Session = {
  user: RsdUser | null,
  token: string,
  status: 'authenticated' | 'missing' | 'invalid' | 'expired' | 'jwtkey' | 'loading',
}

export type AuthSession = {
  session: Session,
  setSession: Dispatch<SetStateAction<Session>>
}

export const defaultSession:Session={
  user: null,
  token: '',
  status: 'missing'
}

export const initSession: AuthSession = {
  session: defaultSession,
  setSession: () => defaultSession
}

/**
 * Page server side
 * Extract token from rsd_token HttpOnly cookie on the server and validate the token.
 * This method can only used on server side (node).
 * @param req
 * @param res
 * @returns
 */
export function getSessionSeverSide(req: IncomingMessage|undefined, res: OutgoingMessage|undefined) {
  // if reqest or response missing we abort
  // this method is only avaliable server side
  if (!req || !res) return null

  // get token from cookie
  const token = getRsdTokenNode(req)
  // create session from token
  const session = createSession(token ?? null)
  // remove invalid cookie
  if (session.status === 'invalid') {
    // console.log('remove rsd cookies...')
    removeRsdTokenNode(res)
    // return default
    return defaultSession
  }
  // return session
  return session
}

/**
 * Extract JWT from rsd_token, validate and decode it.
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export function getRsdTokenNode(req: IncomingMessage){
  // check for cookies
  if (req?.headers?.cookie) {
    // parse cookies from node request
    const cookies = parse(req.headers.cookie)
    // validate and decode
    const token = cookies?.rsd_token
    return token
  } else {
    return null
  }
}

/**
 * Create session from the token.
 * It verifies and decodes JWT received as cookie.
 * @param token
 * @returns Session
 */
export function createSession(token: string | null): Session {
  if (token) {
    const result = verifyJwt(token)
    if (result === 'valid') {
      // decode JWT
      const decoded = decodeJwt(token)
      return {
        user: decoded as RsdUser,
        token,
        status: 'authenticated'
      }
    }
    return {
      user: null,
      token,
      status: result
    }
  }
  return {
    user: null,
    token: '',
    status: 'missing'
  }
}

/**
 * Remove rsd_token cookie. Use it for logout or when invalid token
 * Use this function from _middleware functions of Next SSR
 * @param res
 */
export function removeRsdTokenNode(res: OutgoingMessage) {
  try {
    res.setHeader(
      'Set-Cookie', [
        'rsd_token=deleted; Max-Age=0; Secure; HttpOnly; Path=/; SameSite=Lax;'
      ]
    )
  } catch (e:any) {
    logger(`removeRsdTokenCookie: ${e?.message}`,'error')
  }
}

export function getUserFromToken(token?: string | null) {
  if (token) {
    const result = verifyJwt(token)
    if (result === 'valid') {
      // decode JWT
      const user = decodeJwt(token) as RsdUser
      //
      return user
    }
    return null
  }
  return null
}
