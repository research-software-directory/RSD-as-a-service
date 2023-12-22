// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Return a list of valid OpenID providers
 * based on provided env. RSD_AUTH_PROVIDERS string, semicolon separated values
 * Example! RSD_AUTH_PROVIDERS=surfconext;helmholtzaai
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

// import providers methods
import {surfconextInfo} from './surfconext'
import {helmholtzInfo} from './helmholtzaai'
import {localInfo} from './local'
import {orcidInfo} from './orcid'
import {azureInfo} from './azure'
import logger from '~/utils/logger'

export type ApiError = {
  status: number,
  message: string
}

export type Provider = {
  name: string,
  redirectUrl: string,
  html?: string
}

type Data = Provider[] | ApiError

// cached list of providers
let loginProviders:Provider[] = []

async function getRedirectInfo(provider: string) {
  // select provider
  switch (provider.toLocaleLowerCase()) {
    case 'surfconext':
      // get props needed
      return surfconextInfo()
    case 'helmholtzaai':
      return helmholtzInfo()
    case 'local':
      return localInfo()
    case 'orcid':
      return orcidInfo()
    case 'azure':
      return azureInfo()
    default:
      const message = `${provider} NOT SUPPORTED, check your spelling`
      logger(`api/fe/auth/providers: ${message}`, 'error')
      throw new Error(message)
  }
}

async function getProvidersInfo(){
  // only if we did not loaded info previously
  if (loginProviders.length === 0){
    // extract list of providers, default value surfconext
    const strProviders = process.env.RSD_AUTH_PROVIDERS || 'surfconext'
    // split providers to array on ;
    const providers = strProviders.split(';')

    // add all requests
    const promises: Promise<Provider|null>[] = []
    providers.forEach(provider => {
      promises.push(
        getRedirectInfo(provider)
      )
    })
    // return providers with redirectUrl
    const resp = await Promise.allSettled(promises)
    // filter null responses (if any)
    const info: Provider[] = []
    resp.forEach(item => {
      if (item.status === 'fulfilled') {
        info.push(item.value as Provider)
      }
    })
    // save response into cached variable
    loginProviders = [
      ...info
    ]
    return loginProviders
  }
  // console.log("getProvidersInfo...cached...loginProviders")
  return loginProviders
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // extract list of providers from .env file
    const providers = await getProvidersInfo()
    // return only 'valid' providers
    res.status(200).json(providers)
  } catch (e: any) {
    logger(`api/fe/auth/index: ${e?.message}`, 'error')
    res.status(500).json({
      status: 500,
      message: e?.message
    })
  }
}
