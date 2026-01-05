// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {createContext, useContext, useEffect, useState,PropsWithChildren} from 'react'
import {AuthSession, Session, defaultSession, initSession} from './index'
import refreshSession from './refreshSession'


const AuthContext = createContext<AuthSession>(initSession)

type AuthProviderProps = PropsWithChildren & {
  session: Session,
  refreshMarginInMs?: number,
}
/**
 * AuthProvider used on client side. It keeps session extracted from token on server.
 *
 * @param props
 * @returns
 */
export function AuthProvider(props:AuthProviderProps) {
  const [session, setSession] = useState<Session>(props.session)
  const marginInMs = props?.refreshMarginInMs ?? 5 * 60 * 1000

  // console.group('AuthProvider')
  // console.log('session...', session)
  // console.log('props.session...', props?.session)
  // console.log('marginInMs...', marginInMs)
  // console.groupEnd()

  useEffect(() => {
    // schedule
    let schedule: any
    // only if authenticated = valid token
    if (session.status === 'authenticated'
      && session?.user?.exp) {
      const {user} = session
      const expiresInMs = getExpInMs(user.exp)
      const waitInMs = getWaitInMs(expiresInMs,marginInMs)
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
  }, [session,marginInMs])

  return <AuthContext.Provider value={{session, setSession}} {...props}/>
}

// Auth hook to use in the components
export const useAuth = () => useContext(AuthContext)

// USE more specific session hook which destructures session ONLY
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
function getExpInMs(exp: number) {
  // current time in milliseconds
  const nowInMs = new Date().getTime()
  const diffInMs = Math.floor((exp * 1000) - nowInMs)
  // difference exp and now is in ms
  return diffInMs
}

/**
 * Calculate time to wait before refreshing token, in milliseconds.
 * It uses REFRESH_MARGIN constant to reduce time to schedule token refresh.
 * @param expInMs, marginInMs => REFRESH_MARGIN_MSEC environment variable
 * @returns time to wait in milliseconds
 */
function getWaitInMs(expInMs: number, marginInMs: number) {
  // wait time excl. margin
  const waitInMs = Math.floor(expInMs - marginInMs)
  // if negative return 0
  if (waitInMs < 0) return 0
  // else waiting time in ms
  return waitInMs
}
