// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getSitemap, SitemapInfo} from './getSitemap'

async function getCommunitiesList() {
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
    logger(`getCommunitiesList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getCommunitiesList...${e.message}`, 'error')
    return []
  }
}


export async function getCommunitiesSitemap(domain:string) {
  // get software list
  const items = await getCommunitiesList()

  return getSitemap({
    baseUrl: `${domain}/communities`,
    items
  })
}
