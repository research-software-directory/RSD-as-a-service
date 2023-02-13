// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {PageTitleSticky} from '../layout/PageTitle'
import Breadcrumbs, {SlugInfo} from './Breadcrumbs'

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

export default function OrganisationTitle({title, slug}:
  { title: string, slug: string[]}) {

  return (
    <PageTitleSticky
      style={{padding:'1rem 0rem'}}
    >

      <h1 className="flex-1 w-full md:mt-4 md:mb-2">{title}</h1>
      <div className="w-full mb-4 md:mb-0">
        <Breadcrumbs
          segments={createSegments(slug)}
        />
      </div>

    </PageTitleSticky>
  )
}
