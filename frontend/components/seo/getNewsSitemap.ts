// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getSitemap, SitemapInfo} from './getSitemap'

type NewsList={
  publication_date: string
  slug: string
  updated_at: string
}

async function getNewsList() {
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
    logger(`getNewsList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getNewsList...${e.message}`, 'error')
    return []
  }
}


export async function getNewsSitemap(domain:string) {
  // get software list
  const items = await getNewsList()

  return getSitemap({
    baseUrl: `${domain}/news`,
    items
  })
}
