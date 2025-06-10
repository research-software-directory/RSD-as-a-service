// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getSitemap, SitemapInfo} from './getSitemap'

type PublicProfileInfo={
  account: string
  updated_at: string
}

async function getPublicProfilesList() {
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
    logger(`getPublicProfilesList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getPublicProfilesList...${e.message}`, 'error')
    return []
  }
}


export async function getPublicProfileSitemap(domain:string) {
  // get software list
  const items = await getPublicProfilesList()

  return getSitemap({
    baseUrl: `${domain}/persons`,
    items
  })
}
