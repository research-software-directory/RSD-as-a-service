// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Breadcrumbs, {SlugInfo} from './Breadcrumbs'

type PageBreadcrumbsProps={
  root: SlugInfo
  slug: string[]
}

export default function PageBreadcrumbs({root,slug}:PageBreadcrumbsProps) {
  function createSegments(slug: string[]) {
    // debugger
    const segments:SlugInfo[] = [{
      ...root
    }]
    let path=root.path
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
    <div className="w-full my-4">
      <Breadcrumbs
        segments={createSegments(slug)}
      />
    </div>
  )
}
