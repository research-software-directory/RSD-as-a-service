// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {defaultSession,Session} from '~/auth/index'
import {mockSession} from '~/utils/jest/WithAppContext'

/**
 * Extract token from rsd_token HttpOnly cookie on the server and validate the token.
 * This method can only be used on server side (node).
 * @returns
 */
export const getAppSessionSeverSide=jest.fn(async()=>{
  // return default
  return defaultSession
})

/**
 * Create session from the token.
 * It verifies and decodes JWT received as cookie.
 * @param token
 * @returns Session
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSession=jest.fn(async(token: string | null): Promise<Session>=>{
  // use same mockSession from AppContext
  return mockSession
})

/**
 * Remove rsd_token cookie. Use it for logout or when invalid token
 * @param res
 */
export const removeRsdTokenCookie=jest.fn(async()=>{
  // nothing to return
})

/**
 * Creates user object RsdUser from token and verifies token validity.
 * If token is not present or NOT valid returns null.
 * @param token
 * @returns
 */
export const getUserFromToken=jest.fn(async(token?: string | null)=>{
  if (token) {
    // return user from mockSession
    return mockSession.user
  }
  return null
})
