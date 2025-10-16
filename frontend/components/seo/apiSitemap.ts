// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type SitemapInfo = {
  slug: string,
  updated_at: string
}

export async function getSoftwareForSitemap() {
  try {
    // we set max on 50k
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${getBaseUrl()}/software?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getSoftwareForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getSoftwareForSitemap...${e.message}`, 'error')
    return []
  }
}

export async function getProjectsForSitemap() {
  try {
    const baseUrl = getBaseUrl()
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/project?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getProjectsForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getProjectsForSitemap...${e.message}`, 'error')
    return []
  }
}

export async function getOrganisationsForSitemap() {
  try {
    const baseUrl = getBaseUrl()
    // select only top level organisations (parent IS NULL)
    const query = 'select=slug,updated_at&parent=is.NULL&limit=50000&offset=0'
    const url = `${baseUrl}/organisation?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getOrganisationsForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getOrganisationsForSitemap...${e.message}`, 'error')
    return []
  }
}

export async function getCommunitiesForSitemap() {
  try {
    const baseUrl = getBaseUrl()
    // select only top level organisations (parent IS NULL)
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/community?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getCommunitiesForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getCommunitiesForSitemap...${e.message}`, 'error')
    return []
  }
}

type NewsList={
  publication_date: string
  slug: string
  updated_at: string
}

export async function getNewsForSitemap() {
  try {
    const baseUrl = getBaseUrl()
    // select only top level organisations (parent IS NULL)
    const query = 'select=publication_date,slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/news?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: NewsList[] = await resp.json()
      const news:SitemapInfo[] = json.map(item=>{
        return {
          slug: `${item.publication_date}/${item.slug}`,
          updated_at: item.updated_at
        }
      })

      return news
    }
    logger(`getNewsForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getNewsForSitemap...${e.message}`, 'error')
    return []
  }
}

type PublicProfileInfo={
  account: string
  updated_at: string
}

export async function getPublicProfilesForSitemap() {
  try {
    const baseUrl = getBaseUrl()
    // select only top level organisations (parent IS NULL)
    const query = 'select=account,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/rpc/public_user_profile?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: PublicProfileInfo[] = await resp.json()
      const persons:SitemapInfo[] = json.map(item=>{
        return {
          slug: item.account,
          updated_at: item.updated_at
        }
      })
      return persons
    }
    logger(`getPublicProfilesForSitemap...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getPublicProfilesForSitemap...${e.message}`, 'error')
    return []
  }
}
