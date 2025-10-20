// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

/**
 * GET logout route removes rsd_token if exists and redirects user to homepage.
 */
export async function GET() {
  const cookieStore = await cookies()
  const hasToken = cookieStore.has('rsd_token')

  // delete token if present
  if (hasToken){
    cookieStore.delete('rsd_token')
  }

  // console.group('Logout GET')
  // console.log('hasToken...', hasToken)
  // console.groupEnd()

  // and redirect to homepage
  redirect('/')
}
