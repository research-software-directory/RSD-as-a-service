// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * ORCID OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

import logger from '~/utils/logger'
import {RedirectToProps, getRedirectUrl} from '~/auth/api/authHelpers'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'

async function orcidRedirectProps() {
  try {
    // extract well known url from env
    const wellknownUrl = process.env.ORCID_WELL_KNOWN_URL ?? null
    if (wellknownUrl) {
      // get (cached) authorisation endpoint from wellknown url
      const authorization_endpoint = await getAuthEndpoint(wellknownUrl, 'orcid') ?? null
      if (authorization_endpoint) {
        // construct all props needed for redirectUrl
        const props: RedirectToProps = {
          authorization_endpoint,
          redirect_uri: process.env.ORCID_REDIRECT ?? 'https://research-software.nl/auth/login/orcid',
          redirect_couple_uri: process.env.ORCID_REDIRECT_COUPLE ?? null,
          client_id: process.env.ORCID_CLIENT_ID ?? 'www.research-software.nl',
          scope: process.env.ORCID_SCOPES ?? 'openid',
          response_mode: process.env.ORCID_RESPONSE_MODE ?? 'query'
        }
        return props
      } else {
        const message = 'authorization_endpoint is missing'
        logger(`orcidRedirectProps: ${message}`, 'error')
        return null
      }
    } else {
      const message = 'ORCID_WELL_KNOWN_URL is missing'
      logger(`orcidRedirectProps: ${message}`, 'error')
      return null
    }
  } catch (e: any) {
    logger(`orcidRedirectProps: ${e.message}`, 'error')
    return null
  }
}

export async function orcidInfo() {
  // extract all props from env and wellknown endpoint
  const redirectProps = await orcidRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'ORCID',
      redirectUrl,
      html: 'Sign in with your ORCID account.'
    }
  }
  return null
}
