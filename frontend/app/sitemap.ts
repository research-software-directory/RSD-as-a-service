// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'

/**
 * Homepage related sitemap.xml
 * NOTE! This sitemap need to be referred in robots.txt (robots.ts)
 * @returns sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = await getDomainFromHeader()
  // This is only sitemap for homepage!
  // Other sitemaps are specified in robots.txt
  return [{
    url:`${domain}`,
    lastModified: new Date(),
    changeFrequency: 'weekly'
  }]

}
