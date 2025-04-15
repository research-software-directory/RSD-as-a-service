// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {RedirectToProps} from '~/auth/api/authHelpers'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'

/**
 * Obtain the LinkedIn redirect props for linking LinkedIn account [server side]
 */
export async function linkedInCoupleProps() {
  try{
    const coupleProviders = process.env.RSD_AUTH_COUPLE_PROVIDERS ?? null
    if (!coupleProviders?.includes('LINKEDIN')) {
      // Do not continue if LINKEDIN coupling not enabled
      return null
    }
    // extract well known url from env
    const wellknownUrl = process.env.LINKEDIN_WELL_KNOWN_URL ?? null
    if (wellknownUrl) {
      // get (cached) authorisation endpoint from well known url
      const authorization_endpoint = await getAuthEndpoint(wellknownUrl,'linkedin')
      if (authorization_endpoint && process.env.LINKEDIN_CLIENT_ID) {
        // construct all props needed for redirectUrl
        const props: RedirectToProps = {
          authorization_endpoint,
          redirect_uri: process.env.LINKEDIN_REDIRECT ?? 'https://research-software.nl/auth/login/linkedin',
          redirect_couple_uri: process.env.LINKEDIN_REDIRECT_COUPLE ?? null,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          scope: process.env.LINKEDIN_SCOPES ?? 'openid+profile+email',
          response_mode: process.env.LINKEDIN_RESPONSE_MODE ?? 'code'
        }
        return props
      } else {
        const message = 'authorization_endpoint is missing'
        logger(`linkedInCoupleProps: ${message}`, 'error')
        return null
      }
    } else {
      const message = 'LINKEDIN_WELL_KNOWN_URL is missing'
      logger(`linkedInCoupleProps: ${message}`, 'error')
      return null
    }
  }catch(e:any){
    logger(`linkedInCoupleProps: ${e.message}`, 'error')
    return null
  }
}
