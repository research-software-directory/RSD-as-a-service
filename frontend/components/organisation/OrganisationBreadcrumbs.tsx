// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Breadcrumbs, {SlugInfo} from '../layout/Breadcrumbs'

export default function OrganisationBreadcrumbs({slug}:{slug:string[]}) {
  function createSegments(slug: string[]) {
    const segments:SlugInfo[] = [{
      label: 'organisations',
      path:'/organisations'
    }]
    let path='/organisations'
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
