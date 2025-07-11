// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

// App folder specific implementation
export default function RsdPathnameCookie() {
  const pathname = usePathname()

  useEffect(()=>{
    if (typeof document == 'undefined') return

    // for specific routes
    switch (pathname) {
    // ignore these paths
      case '/auth':
      case '/login':
      case '/logout':
      case '/login/local':
      case '/login/local/couple':
      case '/login/failed':
        break
      case '/':
      // root is send to user/settings
        document.cookie = `rsd_pathname=${location.href}user/settings;path=/auth;SameSite=None;Secure`
        break
      default:
      // write simple browser cookie
      // auth module use this cookie to redirect
      // after successful authentications
        document.cookie = `rsd_pathname=${location.href};path=/auth;SameSite=None;Secure`
    }
  },[pathname])

  if (typeof location == 'undefined') return

  // console.group('RsdPathnameCookie')
  // console.log('pathname...', pathname)
  // console.log('location.href...', location.href)
  // console.groupEnd()

  return null
}
