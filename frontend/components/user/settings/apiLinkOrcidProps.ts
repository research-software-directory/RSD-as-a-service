// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {RedirectToProps} from '~/auth/api/authHelpers'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'

/**
 * Obtain the orcid redirect props for linking ORCID account [server side]
 */
export async function orcidCoupleProps() {
  try{
    const coupleProviders = process.env.RSD_AUTH_COUPLE_PROVIDERS ?? null
    if (!coupleProviders?.includes('ORCID')) {
      // Do not continue if ORCID coupling not enabled
      return null
    }
    // extract well known url from env
    const wellknownUrl = process.env.ORCID_WELL_KNOWN_URL ?? null
    if (wellknownUrl) {
      // get (cached) authorisation endpoint from well known url
      const authorization_endpoint = await getAuthEndpoint(wellknownUrl,'orcid')
      if (authorization_endpoint && process.env.ORCID_CLIENT_ID) {
        // construct all props needed for redirectUrl
        const props: RedirectToProps = {
          authorization_endpoint,
          redirect_uri: process.env.ORCID_REDIRECT ?? 'https://research-software.nl/auth/login/orcid',
          redirect_couple_uri: process.env.ORCID_REDIRECT_COUPLE ?? null,
          client_id: process.env.ORCID_CLIENT_ID,
          scope: process.env.ORCID_SCOPES ?? 'openid',
          response_mode: process.env.ORCID_RESPONSE_MODE ?? 'query'
        }
        return props
      } else {
        const message = 'authorization_endpoint is missing'
        logger(`orcidCoupleProps: ${message}`, 'error')
        return null
      }
    } else {
      const message = 'ORCID_WELL_KNOWN_URL is missing'
      logger(`orcidCoupleProps: ${message}`, 'error')
      return null
    }
  }catch(e:any){
    logger(`orcidCoupleProps: ${e.message}`, 'error')
    return null
  }
}
