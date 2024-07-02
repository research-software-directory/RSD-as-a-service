// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Azure Active Directory OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import logger from '~/utils/logger'
import {RedirectToProps, getRedirectUrl} from '~/auth/api/authHelpers'
import {getAuthEndpoint} from '~/auth/api/authEndpoint'
import {Provider, ApiError} from '.'

type Data = Provider | ApiError

export async function azureRedirectProps() {
  // extract wellknown url from env
  const wellknownUrl = process.env.AZURE_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // get (cached) authorisation endpoint from wellknown url
    const authorization_endpoint = await getAuthEndpoint(wellknownUrl,'azure')
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      const props: RedirectToProps = {
        authorization_endpoint,
        redirect_uri: process.env.AZURE_REDIRECT ?? 'https://research-software.nl/auth/login/azure',
        client_id: process.env.AZURE_CLIENT_ID ?? 'www.research-software.nl',
        scope: process.env.AZURE_SCOPES ?? 'openid',
        response_mode: process.env.AZURE_RESPONSE_MODE ?? 'query',
        prompt: process.env.AZURE_LOGIN_PROMPT
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/azure: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'AZURE_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/azure: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function azureInfo() {
  // extract all props from env and wellknow endpoint
  const redirectProps = await azureRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: process.env.AZURE_DISPLAY_NAME || 'Azure Active Directory',
      redirectUrl,
      html: process.env.AZURE_DESCRIPTION_HTML || 'Login with your institutional credentials.'
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
    const loginInfo = await azureInfo()
    if (loginInfo) {
      res.status(200).json(loginInfo)
    } else {
      res.status(400).json({
        status: 400,
        message: 'loginInfo missing'
      })
    }
  } catch (e: any) {
    logger(`api/fe/auth/azure: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
