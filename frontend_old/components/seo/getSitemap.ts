// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type SitemapInfo = {
  slug: string,
  updated_at: string
}

type SitemapProps = {
  baseUrl: string
  items: SitemapInfo[]
}

export function getSitemap({baseUrl, items}: SitemapProps) {
  // write sitemap.xml file
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${items.map(item => {
    return `
  <url>
    <loc>${`${baseUrl}/${item.slug}`}</loc>
    <lastmod>${item.updated_at}</lastmod>
  </url>
  `
  }).join('')}
</urlset>
 `
}
