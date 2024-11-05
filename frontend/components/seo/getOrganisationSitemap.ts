// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {getSitemap, SitemapInfo} from './getSitemap'

async function getOrganisationList() {
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
    logger(`getOrganisationList...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getOrganisationList...${e.message}`, 'error')
    return []
  }
}


export async function getOrganisationSitemap(domain:string) {
  // get software list
  const items = await getOrganisationList()

  return getSitemap({
    baseUrl: `${domain}/organisations`,
    items
  })
}
