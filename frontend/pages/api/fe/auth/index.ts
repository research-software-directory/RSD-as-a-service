// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Return a list of valid OpenID providers
 * based on provided env. RSD_AUTH_PROVIDERS string, semicolon separated values
 * Example! RSD_AUTH_PROVIDERS=surfconext:everyone;helmholtz:invites_only
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

// import providers methods
import logger from '~/utils/logger'
import {ProviderName} from '~/auth/api/authEndpoint'
import {surfconextInfo} from '~/auth/providers/surfconext'
import {helmholtzInfo} from '~/auth/providers/helmholtzid'
import {localInfo} from '~/auth/providers/local'
import {orcidInfo} from '~/auth/providers/orcid'
import {azureInfo} from '~/auth/providers/azure'
import {linkedinInfo} from '~/auth/providers/linkedin'

export type ProviderFilter = 'INVITE_ONLY'|'EVERYONE'|'ENABLED'
export type AccessType = 'INVITE_ONLY'|'EVERYONE'|'DISABLED'

export type ApiError = {
  status: number,
  message: string
}

export type Provider = {
  name: string,
  redirectUrl: string,
  accessType?: AccessType,
  html?: string
}

type Data = Provider[] | ApiError

async function getRedirectInfo(provider: string) {
  // split provider string and use only
  const providerName = provider.toLocaleLowerCase().split(':')[0] as ProviderName
  const accessType = provider.toLocaleUpperCase().split(':')[1] as AccessType ?? 'DISABLED' as AccessType
  // select provider
  switch (providerName) {
    case 'surfconext':{
      const surf = await surfconextInfo()
      if (surf){
        return {
          ...surf,
          accessType
        }
      }
      return null
    }
    case 'helmholtz':{
      const helm = await helmholtzInfo()
      if (helm){
        return {
          ...helm,
          accessType
        }
      }
      return null
    }
    case 'orcid':{
      const orcid = await orcidInfo()
      if (orcid){
        return {
          ...orcid,
          accessType
        }
      }
      return null
    }
    case 'azure':{
      const azure = await azureInfo()
      if (azure){
        return {
          ...azure,
          accessType
        }
      }
      return null
    }
    case 'linkedin':{
      const link = await linkedinInfo()
      if (link){
        return {
          ...link,
          accessType
        }
      }
      return null
    }
    case 'local':{
      const loc = localInfo()
      if (loc){
        return {
          ...loc,
          accessType
        }
      }
      return null
    }
    default:{
      const message = `${providerName} NOT SUPPORTED, check your spelling`
      logger(`api/fe/auth/index.ts: ${message}`, 'error')
      throw new Error(message)
    }
  }
}
/**
 * ServerSide get list of login providers
 * @param filter
 * @returns
 */
export async function ssrProvidersInfo(filter:ProviderFilter='ENABLED') {
  // extract list of providers, default value surfconext
  const strProviders = process.env.RSD_AUTH_PROVIDERS ?? ''
  // split providers to array on ; and apply filter
  const providers = strProviders.split(';')
    .filter(provider=>{
      // filter out DISABLED providers
      if (filter==='ENABLED') return !provider.toLowerCase().includes(':disabled')
      // always show HELMHOLTZ on invite only page, if present
      if (filter==='INVITE_ONLY' &&
        provider.toLowerCase().includes('helmholtz:')){
        return true
      }
      // match
      return provider.toLowerCase().includes(`:${filter.toLowerCase()}`)
    })

  // add all requests
  const promises: Promise<Provider | null>[] = []
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
    if (item.status === 'fulfilled' && item.value !== null) {
      info.push(item.value)
    }
  })
  return info
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // check for filtering of providers
    const filter = req.query['filter']?.toString() as ProviderFilter ?? 'ENABLED' as ProviderFilter
    // extract list of providers from .env file
    const providers = await ssrProvidersInfo(filter)
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
