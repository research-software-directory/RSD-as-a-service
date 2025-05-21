// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'

/**
 * Return a list of valid OpenID providers
 * based on provided env. RSD_AUTH_PROVIDERS string, semicolon separated values
 * Example! RSD_AUTH_PROVIDERS=surfconext:everyone;helmholtz:invites_only
 */

export type AccessType = 'INVITE_ONLY' | 'EVERYONE'

export type Provider = {
  openidProvider: 'local' | 'surfconext' | 'helmholtz' | 'orcid' | 'azure' | 'linkedin',
  name: string,
  signInUrl: string,
  accessType: AccessType,
  html?: string
}

export async function getLoginProviders(): Promise<Provider[]> {
  try{
    // console.group('getLoginProviders')
    // console.log('loginProviders...', loginProviders)
    // console.groupEnd()

    const url = `${typeof window === 'undefined' ? process.env.RSD_AUTH_URL : '/auth'}/providers`
    // console.log('url...', url)
    const resp = await fetch(url)

    if (resp.status === 200){
      return await resp.json()
    }else{
      logger(`getLoginProviders: ${resp.status}: ${resp.statusText}`, 'warn')
      return []
    }
  }catch(e:any){
    logger(`getLoginProviders: ${e.message}`, 'error')
    return []
  }
}
