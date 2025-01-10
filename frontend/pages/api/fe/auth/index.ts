// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Return a list of valid OpenID providers
 * based on provided env. RSD_AUTH_PROVIDERS string, semicolon separated values
 * Example! RSD_AUTH_PROVIDERS=surfconext;helmholtzid
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

// import providers methods
import {surfconextInfo} from './surfconext'
import {helmholtzInfo} from './helmholtzid'
import {localInfo} from './local'
import {orcidInfo} from './orcid'
import {azureInfo} from './azure'
import {linkedinInfo} from './linkedin'
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

async function getRedirectInfo(provider: string) {
  // select provider
  switch (provider.toLocaleLowerCase()) {
    case 'surfconext':
      // get props needed
      return surfconextInfo()
    case 'helmholtzid':
      return helmholtzInfo()
    case 'local':
      return localInfo()
    case 'orcid':
      return orcidInfo()
    case 'azure':
      return azureInfo()
    case 'linkedin':
      return linkedinInfo()
    default:
      const message = `${provider} NOT SUPPORTED, check your spelling`
      logger(`api/fe/auth/providers: ${message}`, 'error')
      throw new Error(message)
  }
}

async function getProvidersInfo(){
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
  return info
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
