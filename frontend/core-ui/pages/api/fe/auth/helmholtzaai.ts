// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Helmholz AAI OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getAuthorisationEndpoint, RedirectToProps, claims, getRedirectUrl} from '~/auth/api/authHelpers'
import logger from '~/utils/logger'
import {Provider, ApiError} from '.'

type Data = Provider | ApiError

async function helmholtzRedirectProps() {
  // extract wellknow url from env
  const wellknownUrl = process.env.HELMHOLTZAAI_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // extract authorisation endpoint from wellknow response
    const authorization_endpoint = await getAuthorisationEndpoint(wellknownUrl)
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      // use default values if env not provided
      const props: RedirectToProps = {
        authorization_endpoint,
        client_id: process.env.HELMHOLTZAAI_CLIENT_ID || 'rsd-dev',
        redirect_uri: process.env.HELMHOLTZAAI_REDIRECT || 'http://localhost/auth/login/helmholtzaai',
        scope: process.env.HELMHOLTZAAI_SCOPES || 'openid+profile+email+eduperson_principal_name',
        response_mode: process.env.HELMHOLTZAAI_RESPONSE_MODE || 'query',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/helmholtzaai: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'HELMHOLTZAAI_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/helmholtzaai: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function helmholtzInfo() {
  // extract all props from env and wellknow endpoint
  const redirectProps = await helmholtzRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'Helmholtz AAI',
      redirectUrl,
      html: `
        Sign in with Helmholtz AAI is enabled for all members of the <strong>Helmholtz Research Foundation</strong>.
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
    const loginInfo = await helmholtzInfo()
    if (loginInfo) {
      res.status(200).json(loginInfo)
    } else {
      res.status(400).json({
        status: 400,
        message: 'loginInfo missing'
      })
    }
  } catch (e: any) {
    logger(`api/fe/auth/helmholtzaai: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
