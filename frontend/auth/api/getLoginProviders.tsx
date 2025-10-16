// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'

export type ProviderName = 'surfconext'|'helmholtz'|'orcid'|'azure'|'linkedin'|'local'
export type AccessType = 'INVITE_ONLY' | 'EVERYONE'

export type Provider = {
  openidProvider: ProviderName,
  name: string,
  signInUrl: string,
  coupleUrl: string,
  accessType: AccessType,
  html?: string
}

export async function getLoginProviders(): Promise<Provider[]> {
  try{
    const url = `${typeof window === 'undefined' ? process.env.RSD_AUTH_URL : '/auth'}/providers`

    // console.group('getLoginProviders')
    // console.log('url...', url)
    // console.groupEnd()

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
