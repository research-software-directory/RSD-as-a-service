// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import {parse} from 'cookie'

export type Matomo = {
  id: string | null
  consent: boolean | null
}

/**
 * Extract Matomo cookies
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export function getMatomoCookies(req: IncomingMessage) {
  // check for cookies
  if (req?.headers?.cookie) {
    // parse cookies from node request
    const cookies = parse(req.headers.cookie)
    // validate and decode
    return {
      mtm_consent: cookies?.mtm_consent,
      mtm_consent_removed: cookies?.mtm_consent_removed
    }
  } else {
    return {
      mtm_consent: undefined,
      mtm_consent_removed: undefined
    }
  }
}


/**
 * Extract matomo consent based on cookies
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export function getMatomoConsent(req:IncomingMessage) {
  // check for cookies
  // console.log('getMatomoConsent...', req)
  if (req?.headers?.cookie) {
    const matomo = getMatomoCookies(req)
    if (matomo?.mtm_consent) {
      return {
        matomoConsent: true
      }
    } else if (matomo?.mtm_consent_removed) {
      return {
        matomoConsent: false
      }
    }
  }
  return {
    matomoConsent: null
  }
}
