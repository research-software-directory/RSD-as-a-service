// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, Dispatch, SetStateAction, useState, useContext, useEffect} from 'react'
import {IncomingMessage, OutgoingMessage} from 'http'
import {parse} from 'cookie'
import logger from '~/utils/logger'
import verifyJwt, {decodeJwt} from './jwtUtils'
import {refreshSession} from './refreshSession'

// refresh schedule margin 5min. before expiration time
// REFRESH_MARGIN_MSEC env variable is used for test purposes ONLY
const testMargin = process.env.REFRESH_MARGIN_MSEC ? parseInt(process.env.REFRESH_MARGIN_MSEC) : undefined
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

const AuthContext = createContext<AuthSession>(initSession)

// AuthProvider used in _app to share session between all components
export function AuthProvider(props: any) {
  const [session, setSession] = useState<Session>(props?.session)

  // console.group('AuthProvider')
  // console.log('session...', session)
  // console.log('props.session...', props?.session)
  // console.groupEnd()

  useEffect(() => {
    // schedule
    let schedule: any
    // only if authenticated = valid token
    if (session.status === 'authenticated'
      && session?.user?.exp) {
      const {user} = session
      const expiresInMs = getExpInMs(user.exp)
      const waitInMs = getWaitInMs(expiresInMs)
      // console.log('waitInMs...', waitInMs)
      if (schedule) clearTimeout(schedule)
      if (expiresInMs <= 0) {
        // token expired
        setSession({
          ...session,
          status: 'expired',
          token: `AuthProvider session EXPIRED for account ${session.user.account}`,
          user: null
        })
      }else{
        // console.log(`schedule refresh in ${waitInMs/1000}sec.`)
        schedule = setTimeout(() => {
          // console.log('call...refreshSession...',user.account)
          // refresh token by sending current valid cookie
          refreshSession()
            .then(newSession => {
              // console.log('newSession.token...', newSession?.token)
              // update only if "valid" session
              if (newSession?.status === 'authenticated') {
                setSession(newSession)
                // console.log('AuthProvider...session...UPDATED')
              } else {
                // replace with default, not authenticated
                setSession(defaultSession)
                // console.log('AuthProvider...session...REMOVED')
              }
            })
        },waitInMs)
      }
    }
    return () => {
      if (schedule) {
        // console.log('remove schedule...', schedule)
        clearTimeout(schedule)
      }
    }
  }, [session])

  return <AuthContext.Provider value={{session, setSession}} {...props}/>
}

// Auth hook to use in the components
export const useAuth = () => useContext(AuthContext)

// More specific session hook which destructures session
export function useSession(){
  const {session} = useContext(AuthContext)

  // console.group('useSession')
  // console.log('session...', session)
  // console.groupEnd()

  return {
    ...session
  }
}

/**
 * Calculate expiration time from now in milliseconds
 * @param exp in seconds
 * @returns difference in milliseconds
 */
export function getExpInMs(exp: number) {
  // current time in milliseconds
  const nowInMs = new Date().getTime()
  const diffInMs = Math.floor((exp * 1000) - nowInMs)
  // difference exp and now is in ms
  return diffInMs
}

/**
 * Calculate time to wait before refreshing token, in milliseconds.
 * It uses REFRESH_MARGIN constant to reduce time to schedule token refresh.
 * @param expInMs
 * @returns time to wait in milliseconds
 */
export function getWaitInMs(expInMs: number) {
  // wait time excl. margin
  const waitInMs = Math.floor(expInMs - REFRESH_MARGIN)
  // if negative return 0
  if (waitInMs < 0) return 0
  // else waiting time in ms
  return waitInMs
}

/**
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
