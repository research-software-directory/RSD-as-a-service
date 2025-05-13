// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'
import {getRedirectUrl, RedirectToProps} from '~/auth/api/authHelpers'

async function linkedinRedirectProps() {
  try {
    // extract well known url from env
    const wellknownUrl = process.env.LINKEDIN_WELL_KNOWN_URL
    if (!wellknownUrl) {
      const message = 'LINKEDIN_WELL_KNOWN_URL is missing'
      logger(`linkedinRedirectProps: ${message}`, 'error')
      return null
    }

    const authorization_endpoint = await getAuthEndpoint(wellknownUrl, 'linkedin')
    if (!authorization_endpoint) {
      const message = 'authorization_endpoint is missing'
      logger(`linkedinRedirectProps: ${message}`, 'error')
      return null
    }

    const redirect_uri = process.env.LINKEDIN_REDIRECT
    if (!redirect_uri) {
      const message = 'LINKEDIN_REDIRECT is missing'
      logger(`linkedinRedirectProps: ${message}`, 'error')
      return null
    }

    const client_id = process.env.LINKEDIN_CLIENT_ID
    if (!client_id) {
      const message = 'LINKEDIN_CLIENT_ID is missing'
      logger(`linkedinRedirectProps: ${message}`, 'error')
      return null
    }

    const props: RedirectToProps = {
      authorization_endpoint,
      redirect_uri,
      client_id,
      scope: process.env.LINKEDIN_SCOPES ?? 'openid%20profile%20email',
      response_mode: process.env.LINKEDIN_RESPONSE_MODE ?? 'code'
    }
    return props
  } catch (e: any) {
    logger(`orcidRedirectProps: ${e.message}`, 'error')
    return null
  }
}

export async function linkedinInfo() {
  const redirectProps = await linkedinRedirectProps()
  if (!redirectProps) {
    return null
  }

  const redirectUrl = getRedirectUrl(redirectProps)

  return {
    name: 'LinkedIn',
    redirectUrl,
    html: 'Sign in with your LinkedIn account.'
  }
}
