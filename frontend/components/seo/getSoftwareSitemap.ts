// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getRsdSettings} from '~/config/getSettingsServerSide'
import {getSitemap, SitemapInfo} from './getSitemap'

async function getSoftwareList() {
  try {
    const baseUrl = getBaseUrl()
    // we set max on 50k
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/software?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getSoftwareSitemap.getSoftwareList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getSoftwareSitemap.getSoftwareList...${e.message}`, 'error')
    return []
  }
}


export async function getSoftwareSitemap(domain:string) {
  // get software list
  const items = await getSoftwareList()
  const {host} = await getRsdSettings()

  return getSitemap({
    baseUrl:`${domain}/software`,
    items
  })
}
