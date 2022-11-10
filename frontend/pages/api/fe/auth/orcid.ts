// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * ORCID OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getAuthorisationEndpoint, RedirectToProps, claims, getRedirectUrl} from '~/auth/api/authHelpers'
import logger from '~/utils/logger'
import {Provider, ApiError} from '.'

type Data = Provider | ApiError

export async function orcidRedirectProps() {
  // extract wellknow url from env
  const wellknownUrl = process.env.ORCID_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // extract authorisation endpoint from wellknow response
    const authorization_endpoint = await getAuthorisationEndpoint(wellknownUrl)
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      const props: RedirectToProps = {
        authorization_endpoint,
        redirect_uri: process.env.ORCID_REDIRECT || 'https://research-software.nl/auth/login/orcid',
        client_id: process.env.ORCID_CLIENT_ID || 'www.research-software.nl',
        scope: process.env.ORCID_SCOPES || 'openid',
        response_mode: process.env.ORCID_RESPONSE_MODE || 'query',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/orcid: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'ORCID_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/orcid: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function orcidInfo() {
  // extract all props from env and wellknow endpoint
  const redirectProps = await orcidRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'ORCID',
      redirectUrl,
      html: `
        Sign in with ORCID is supported <strong>only for persons invited by the RSD administrators</strong>.
        <strong><a href="mailto:rsd@esciencecenter.nl?subject=${encodeURIComponent('Login with ORCID')}" target="_blank">Contact us</a></strong> if you wish to login with your ORCID.
      `
    }
  }
  return null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // extract all props from env and wellknow endpoint
    // and create return url and the name to use in login button
    const loginInfo = await orcidInfo()
    if (loginInfo) {
      res.status(200).json(loginInfo)
    } else {
      res.status(400).json({
        status: 400,
        message: 'loginInfo missing'
      })
    }
  } catch (e: any) {
    logger(`api/fe/auth/orcid: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
