// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getSoftwareForSitemap} from '~/components/seo/apiSitemap'

/**
 * Software related sitemap.xml
 * NOTE! This sitemap need to be referred in robots.txt (robots.ts)
 * @returns sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // get domain and active rsd modules
  const [domain, modules]= await Promise.all([
    getDomainFromHeader(),
    getActiveModuleNames()
  ])

  // if module is not enabled we return empty sitemap.xml
  if (modules.includes('software')===false){
    return []
  }
  // get software list (max. 50K)
  const software = await getSoftwareForSitemap()

  // return array of software for sitemap
  return software.map(item=>{
    return {
      url:`${domain}/software/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
