// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getAuthorisationEndpoint} from './authHelpers'

export type ProviderName = 'surfconext'|'helmholtz'|'orcid'|'azure'|'linkedin'|'local'
// how often we refresh auth endpoint
const refreshInterval = 60*60*1000
// save timer as public variable
let timer:NodeJS.Timeout
// save authorisation endpoint info
const cache:{
  [key:string]:{
    authEndpoint?: string
    wellknownUrl: string
  }
}={}

/**
 * We save authorization_endpoint in memory to avoid repeating calls
 * refreshInterval defined how often we refresh auth endpoint info.
 *
 */
export async function getAuthEndpoint(wellknownUrl:string,provider:ProviderName){
  try{
    // if already present return existing value
    if (cache?.[provider]?.authEndpoint) {
      // console.log('getAuthEndpoint...CACHE used...', new Date())
      return cache[provider].authEndpoint
    }
    // if not present request endpoint info
    cache[provider] = {
      wellknownUrl,
      authEndpoint: await getAuthorisationEndpoint(wellknownUrl)
    }
    // we set timer only in the production because hot-reloading creates multiple instances
    if (process.env.NODE_ENV==='production'){
      // clear previous timer to avoid mem leaks
      if (timer){
        // console.log('getAuthEndpoint...CLEAR INTERVAL...', new Date())
        clearInterval(timer)
      }
      // create refresh interval and store it
      timer = setInterval(async()=>{
        // console.log('getAuthEndpoint...REFRESH INFO...', new Date())
        // refresh all cached providers
        const providers = Object.keys(cache)
        const requests = providers.map(provider=>{
          return getAuthorisationEndpoint(cache[provider].wellknownUrl)
        })
        // perform all requests in parallel
        const endpoints = await Promise.all(requests)
        // update all providers
        providers.forEach((provider,pos)=>{
          // update only if there is info
          if (endpoints[pos]) {
            // console.log(`getAuthEndpoint...${provider}...`, endpoints[pos])
            cache[provider].authEndpoint = endpoints[pos]
          }
        })
      },refreshInterval)
    }
    // console.log('getAuthEndpoint...REQUEST made...', new Date())
    return cache[provider]?.authEndpoint
  }catch(e:any){
    logger(`getAuthEndpoint: ${e.message}`, 'error')
    return undefined
  }
}
