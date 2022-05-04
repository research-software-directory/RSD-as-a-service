/**
 * SURFconext OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getAuthorisationEndpoint, RedirectToProps, claims, getRedirectUrl} from '~/auth/api/authHelpers'
import logger from '~/utils/logger'
import {Provider, ApiError} from '.'

type Data = Provider | ApiError

export async function surfconextRedirectProps() {
  // extract wellknow url from env
  const wellknownUrl = process.env.NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL ?? null
  if (wellknownUrl) {
    // extract authorisation endpoint from wellknow response
    const authorization_endpoint = await getAuthorisationEndpoint(wellknownUrl)
    if (authorization_endpoint) {
      // construct all props needed for redirectUrl
      const props: RedirectToProps = {
        authorization_endpoint,
        redirect_uri: process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT || 'https://research-software.nl//auth/login/surfconext',
        client_id: process.env.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID || 'www.research-software.nl',
        scope: process.env.NEXT_PUBLIC_SURFCONEXT_SCOPES || 'openid',
        response_mode: process.env.NEXT_PUBLIC_SURFCONEXT_RESPONSE_MODE || 'form_post',
        claims
      }
      return props
    } else {
      const message = 'authorization_endpoint is missing'
      logger(`api/fe/auth/surfconext: ${message}`, 'error')
      throw new Error(message)
    }
  } else {
    const message = 'NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL is missing'
    logger(`api/fe/auth/surfconext: ${message}`, 'error')
    throw new Error(message)
  }
}

export async function surfconextInfo() {
  // extract all props from env and wellknow endpoint
  const redirectProps = await surfconextRedirectProps()
  if (redirectProps) {
    // create return url and the name to use in login button
    const redirectUrl = getRedirectUrl(redirectProps)
    // provide redirectUrl and name/label
    return {
      name: 'SURFconext',
      redirectUrl
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
    const loginInfo = await surfconextInfo()
    if (loginInfo) {
      res.status(200).json(loginInfo)
    } else {
      res.status(400).json({
        status: 400,
        message: 'loginInfo missing'
      })
    }
  } catch (e: any) {
    logger(`api/fe/auth/surfconext: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
