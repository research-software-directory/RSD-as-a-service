// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {RedirectToProps, getAuthorisationEndpoint} from '~/auth/api/authHelpers'

// save timer as public variable
let timer:NodeJS.Timer
// save authorisation endpoint info as public variable
let orcid_endpoint:string|null=null
/**
 * We save authorization_endpoint in memory
 * to avoid repeating calls when user is navigating between sections
 */
async function orcidAuthEndpoint(wellknownUrl:string){
  try{
    const refreshInterval = 60*60*1000
    // if already present return existing value
    if (orcid_endpoint) {
      // console.log('orcidAuthEndpoint...CACHE used...', new Date())
      return orcid_endpoint
    }
    // if not present request endpoint info
    orcid_endpoint = await getAuthorisationEndpoint(wellknownUrl) ?? null
    // we set timer only in the production because hot-reloading creates multiple instances
    // TODO! investigate other approaches that work identical in dev and production
    if (process.env.NODE_ENV==='production'){
      // clear previous timer to avoid mem leaks
      if (timer){
        // console.log('orcidAuthEndpoint...CLEAR INTERVAL...', new Date())
        clearInterval(timer)
      }
      // create refresh interval and store it
      timer = setInterval(async()=>{
        // console.log('orcidAuthEndpoint...REFRESH INFO...', new Date())
        orcid_endpoint = await getAuthorisationEndpoint(wellknownUrl) ?? null
      },refreshInterval)
    }
    // console.log('orcidAuthEndpoint...REQUEST made...', new Date())
    return orcid_endpoint
  }catch(e:any){
    logger(`orcidAuthEndpoint: ${e.message}`, 'error')
    return null
  }
}

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
      const authorization_endpoint = await orcidAuthEndpoint(wellknownUrl)
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
