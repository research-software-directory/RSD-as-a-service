// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {cookies} from 'next/headers'

import {app} from '~/config/app'
import logger from '~/utils/logger'
import verifyJwt, {decodeJwt} from './jwtUtils'
import {RsdUser, Session, defaultSession} from './index'

/**
 * Extract token from rsd_token HttpOnly cookie on the server and validate the token.
 * This method can only be used on server side (node).
 * @returns
 */
export async function getAppSessionSeverSide() {
  // get token from cookie
  const token = await getRsdTokenFromCookie()
  // create session from token
  const session = await createSession(token)
  // remove invalid cookie
  if (session.status === 'invalid') {
    // console.log('remove rsd cookies...')
    await removeRsdTokenCookie()
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
async function getRsdTokenFromCookie() {
  // check for cookies
  const cookie = await cookies()
  const token = cookie.get(app.rsdTokenId)
  if (token && token?.value) {
    // validate and decode
    return token?.value
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
export async function createSession(token: string | null): Promise<Session> {
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
 * @param res
 */
export async function removeRsdTokenCookie() {
  try {
    const cookie = await cookies()
    cookie.delete(app.rsdTokenId)

  } catch (e: any) {
    logger(`removeRsdTokenCookie: ${e?.message}`, 'error')
  }
}

/**
 * Creates user object RsdUser from token and verifies token validity.
 * If token is not present or NOT valid returns null.
 * @param token
 * @returns
 */
export async function getUserFromToken(token?: string | null) {
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
