// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import type {MetadataRoute} from 'next'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'

export default async function robots(): Promise<MetadataRoute.Robots>{
  // get host from headers and active modules
  const [domain, modules] = await Promise.all([
    getDomainFromHeader(),
    getActiveModuleNames()
  ])

  const sitemap = modules.map(item=>`${domain}/${item}/sitemap.xml`)
  // add homepage
  sitemap.push(`${domain}/sitemap.xml`)

  // console.group('robots')
  // console.log('domain...', domain)
  // console.log('sitemap...', sitemap)
  // console.group()

  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/admin/',
        '/auth/',
        '/invite/',
        '/login/',
        '/user/'
      ]
    },
    sitemap,
  }
}
