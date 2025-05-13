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
 * SURFconext OpenID info
 * It provides frontend with redirect uri for the login button
 */
import logger from '~/utils/logger'
import {RedirectToProps, getRedirectUrl} from '~/auth/api/authHelpers'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'

const claims = {
  id_token: {
    schac_home_organization: null,
    name: null,
    email: null
  }
}

async function surfconextRedirectProps() {
  // extract wellknown url from env
  const wellknownUrl = process.env.SURFCONEXT_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // get (cached) authorisation endpoint from wellknown url
    const authorization_endpoint = await getAuthEndpoint(wellknownUrl, 'surfconext') ?? null
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      const props: RedirectToProps = {
        authorization_endpoint,
        redirect_uri: process.env.SURFCONEXT_REDIRECT ?? 'https://research-software.nl/auth/login/surfconext',
        client_id: process.env.SURFCONEXT_CLIENT_ID ?? 'www.research-software.nl',
        scope: process.env.SURFCONEXT_SCOPES ?? 'openid',
        response_mode: process.env.SURFCONEXT_RESPONSE_MODE ?? 'form_post',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/surfconext: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'SURFCONEXT_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/surfconext: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function surfconextInfo() {
  // extract all props from env and wellknown endpoint
  const redirectProps = await surfconextRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'SURFconext',
      redirectUrl,
      html: `Sign in with SURFconext is for <strong>Dutch Institutions</strong> who enabled the
      RSD service in the SURFconext IdP dashboard.`
    }
  }
  return null
}
