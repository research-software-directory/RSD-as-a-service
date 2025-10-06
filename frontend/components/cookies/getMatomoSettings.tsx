// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {cookies} from 'next/headers'

import logger from '~/utils/logger'

export type Matomo = {
  id: string | null
  consent: boolean | null
}

export type MatomoSettings = Matomo & {
  url: string | null
}

function getMatomoInfo(){
  // we need to use || instead of ?? because "" is also value for ??
  const id = process.env.MATOMO_ID || null
  // we need to use || instead of ?? because "" is also value for ??
  const url = process.env.MATOMO_URL || null
  return {
    id,
    url
  }
}

export async function getMatomoSettings():Promise<MatomoSettings>{
  try {
    // check for mtm cookies
    const cookie = await cookies()
    const [mtm_consent,mtm_consent_removed] = await Promise.all([
      cookie.get('mtm_consent'),
      cookie.get('mtm_consent_removed')
    ])
    // returns object {name: "", value: ""}
    // const mtm_consent = cookie.get('mtm_consent')
    // returns object {name: "", value: ""}
    // const mtm_consent_removed = cookie.get('mtm_consent_removed')
    // extract id and url from .env
    const {id,url} = getMatomoInfo()

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
  } catch(e:any) {
    logger(`getMatomoSettings failed ${e?.message ?? e}`,'warn')
    return {
      id: null,
      url: null,
      consent: null
    }
  }
}
