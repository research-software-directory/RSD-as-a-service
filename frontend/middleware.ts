// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextRequest, NextResponse} from 'next/server'
import {getCspHeader} from './utils/getCspHeader'

/**
 * Middleware used to set CSP headers to each request/response
 * Note! node crypto module need to addressed as in line 12 in the middleware. *
 * @param request
 * @returns response:NextResponse
 */
export function middleware(request: NextRequest) {
  // taken from documentation https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  // create csp header string
  const cspHeader = getCspHeader(nonce)

  // set nonce to request header
  // we extract nonce value in the root layout.tsx
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // add CSP to response header
  // REPORT ONLY in dev mode
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      cspHeader
    )
  } else {
    response.headers.set(
      'Content-Security-Policy-Report-Only',
      cspHeader
    )
  }

  // return response
  return response
}
