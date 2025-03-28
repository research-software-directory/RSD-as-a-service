// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Provider} from 'pages/api/fe/auth'
import logger from '~/utils/logger'

// save info after initial call
let loginProviders:Provider[] = []

export async function getLoginProviders(baseUrl?:string) {
  try{
    // console.group('getLoginProviders')
    // console.log('baseUrl...', baseUrl)
    // console.log('loginProviders...', loginProviders)
    // console.groupEnd()

    if (loginProviders.length === 0){
      // baseUrl is required for requests from server side
      // this is internal url of frontend, by default this
      // is http://localhost:3000
      const url = `${baseUrl ?? ''}/api/fe/auth`
      // console.log('url...', url)
      const resp = await fetch(url)

      if (resp.status === 200){
        const providers: Provider[] = await resp.json()
        // api response is the same once the app is started
        // because the info eventually comes from .env file
        // to avoid additional api calls we save api response
        // into the loginProviders variable and reuse it
        loginProviders = [
          ...providers
        ]
      }else{
        logger(`getLoginProviders: ${resp.status}: ${resp.statusText}`, 'warn')
      }
    }
    return loginProviders
  }catch(e:any){
    logger(`getLoginProviders: ${e.message}`, 'error')
    return loginProviders
  }
}
