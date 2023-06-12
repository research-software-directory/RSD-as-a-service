// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export function saveLocationCookie() {
  // console.log('saveLocationCookie...', location.pathname.toLowerCase())
  // only in browser mode
  if (typeof document == 'undefined') return
  if (typeof location == 'undefined') return
  // for specific routes
  switch (location.pathname.toLowerCase()) {
    // ingnore these paths
    case '/auth':
    case '/login':
    case '/logout':
    case '/login/local':
    case '/login/failed':
      break
    case '/':
      // root is send to /software
      document.cookie = `rsd_pathname=${location.href}software;path=/auth;SameSite=None;Secure`
      break
    default:
      // write simple browser cookie
      // auth module use this cookie to redirect
      // after succefull authentications
      document.cookie = `rsd_pathname=${location.href};path=/auth;SameSite=None;Secure`
  }
}
