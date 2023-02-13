// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getRsdSettings} from '~/config/getSettingsServerSide'
import {getSitemap, SitemapInfo} from './getSitemap'

async function getProjectsList() {
  try {
    const baseUrl = getBaseUrl()
    const query = 'select=slug,updated_at&limit=50000&offset=0'
    const url = `${baseUrl}/project?${query}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: SitemapInfo[] = await resp.json()
      return json
    }
    logger(`getProjectsSitemap.getProjectsList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getProjectsSitemap.getProjectsList...${e.message}`, 'error')
    return []
  }
}


export async function getProjectsSitemap(domain:string) {
  // get software list
  const items = await getProjectsList()
  const {host} = await getRsdSettings()

  return getSitemap({
    baseUrl: `${domain}/projects`,
    items
  })
}
