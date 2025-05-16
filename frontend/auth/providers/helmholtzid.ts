// SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Helmholz ID OpenID info
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

async function helmholtzRedirectProps() {
  // extract wellknow url from env
  const wellknownUrl = process.env.HELMHOLTZID_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // get (cached) authorisation endpoint from wellknown url
    const authorization_endpoint = await getAuthEndpoint(wellknownUrl, 'helmholtz')
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      // use default values if env not provided
      const props: RedirectToProps = {
        authorization_endpoint,
        client_id: process.env.HELMHOLTZID_CLIENT_ID ?? 'rsd-dev',
        redirect_uri: process.env.HELMHOLTZID_REDIRECT ?? 'http://localhost/auth/login/helmholtzid',
        scope: process.env.HELMHOLTZID_SCOPES ?? 'openid+profile+email+eduperson_principal_name',
        response_mode: process.env.HELMHOLTZID_RESPONSE_MODE ?? 'query',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/helmholtzid: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'HELMHOLTZID_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/helmholtzid: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function helmholtzInfo() {
  // extract all props from env and wellknown endpoint
  const redirectProps = await helmholtzRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'Helmholtz ID',
      redirectUrl,
      html: `
        Sign in with Helmholtz ID is enabled for all members of the <strong>Helmholtz Research Foundation</strong>.
      `
    }
  }
  return null
}
