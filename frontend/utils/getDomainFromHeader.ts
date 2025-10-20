// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {headers} from 'next/headers'

export async function getDomainFromHeader(){
  const headerList = await headers()

  const host = headerList.get('host') ?? 'localhost'
  // by default we use https protocol
  let protocol = 'https'
  if (host.startsWith('localhost')===true) {
    // we use http when local host
    protocol = 'http'
  }

  return `${protocol}://${host}`
}
