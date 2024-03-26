// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Breadcrumbs, {SlugInfo} from '~/components/layout/Breadcrumbs'

export default function NewsItemBreadcrumbs({slug}:{slug:string[]}) {
  function createSegments(slug: string[]) {
    const segments:SlugInfo[] = [{
      label: 'news',
      path:'/news'
    }]
    let path='/news'
    slug.forEach((item, pos) => {
      if (pos === slug.length - 1) {
        // last segment is current page
        // so we do not place link/path
        segments.push({
          label: item,
          path: null
        })
      } else {
        path += `/${item}`
        segments.push({
          label: item,
          path
        })
      }
    })
    return segments
  }
  return (
    <Breadcrumbs
      segments={createSegments(slug)}
    />
  )
}
