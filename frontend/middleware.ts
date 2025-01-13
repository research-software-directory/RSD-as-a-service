// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/communities')) {
    return NextResponse.redirect(request.url + '/software')
  }

  if (request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(request.url + '/software')
  }
}

export const config = {
  matcher: ['/communities/:path/', '/profile/:orcid/']
}
