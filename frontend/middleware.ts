// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(request.url + '/software')
}

export const config = {
  matcher: '/communities/:path/',
}
