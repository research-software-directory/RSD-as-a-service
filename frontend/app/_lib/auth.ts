// SPDX-FileCopyrightText: 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {cookies, headers} from 'next/headers'

export async function getRsdToken() {
  const cookieStore = await cookies()
  return cookieStore.get('rsd_token')?.value || undefined
}

export async function getAllCookie() {
  const cookieStore = await cookies()
  return cookieStore.getAll()
}

export async function getAllHeaders() {
  const headerList = await headers()
  return Object.fromEntries(headerList.entries())
}

export async function isUsersProfile(profile_id: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('rsd_token')?.value || undefined
  return userId === profile_id
}
