// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {cookies} from 'next/headers'
import {Matomo} from './nodeCookies'

export type MatomoSettings = Matomo & {
  url: string | null
}

const id = process.env.MATOMO_ID ?? null
const url = process.env.MATOMO_URL ?? null

export async function getMatomoSettings():Promise<MatomoSettings>{
  try {
    // check for mtm cookies
    const cookie = await cookies()
    // returns object {name: "", value: ""}
    const mtm_consent = cookie.get('mtm_consent')
    // returns object {name: "", value: ""}
    const mtm_consent_removed = cookie.get('mtm_consent_removed')

    if (mtm_consent) {
      return {
        id,
        url,
        consent: true
      }
    } else if (mtm_consent_removed) {
      return {
        id,
        url,
        consent: false
      }
    }
    return {
      id,
      url,
      consent: null
    }
  } catch {
    return {
      id,
      url,
      consent: null
    }
  }
}
