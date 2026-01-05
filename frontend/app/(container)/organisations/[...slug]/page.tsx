// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Suspense} from 'react'
import {notFound} from 'next/navigation'

import logger from '~/utils/logger'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import NavContentSkeleton from '~/components/layout/NavContentSkeleton'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'
import OrganisationSoftware from '~/components/organisation/software'
import OrganisationProjects from '~/components/organisation/projects'
import OrganisationSoftwareReleases from '~/components/organisation/releases'
import OrganisationUnits from '~/components/organisation/units'
import OrganisationSettings from '~/components/organisation/settings'
import AboutOrganisation from '~/components/organisation/about'

export default async function OrganisationPage({
  params,
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | undefined}>,
  params: Promise<{slug: string[]}>,
}>) {

  const [{slug},query,modules] = await Promise.all([
    params,
    searchParams,
    getActiveModuleNames()
  ])

  const tab = query?.['tab'] ?? modules[0] as TabKey
  // const layout = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  // console.group('OrganisationPage')
  // console.log('slug...', slug)
  // console.log('query...', query)
  // console.log('tab...', tab)
  // console.log('modules...', modules)
  // console.groupEnd()

  // tab router
  switch (tab) {
    case 'software':
      return (
        // Suspense is not support when Javascript is disabled!
        // <Suspense fallback={<FilterSearchCardSkeleton layout={layout} count={rsd_page_rows} />}>
        <OrganisationSoftware slug={slug} query={query} />
        // </Suspense>
      )
    case 'projects':
      return (
        // Suspense is not support when Javascript is disabled!
        // <Suspense fallback={<FilterSearchCardSkeleton layout={layout} count={rsd_page_rows} />}>
        <OrganisationProjects slug={slug} query={query} />
        // </Suspense>
      )
    case 'releases':
      return (
        // Suspense is not support when Javascript is disabled!
        // <Suspense fallback={<ListContentSkeleton lines={rsd_page_rows} />}>
        <OrganisationSoftwareReleases slug={slug} query={query}/>
        // </Suspense>
      )
    case 'units':
      return (
        // Suspense is not support when Javascript is disabled!
        // <Suspense fallback={<ListContentSkeleton lines={rsd_page_rows} />}>
        <OrganisationUnits slug={slug}/>
        // </Suspense>
      )
    case 'settings':
      return (
        // Suspense is not support when Javascript is disabled!
        // But to edit settings Javascript is REQUIRED!
        <Suspense fallback={<NavContentSkeleton />}>
          <OrganisationSettings slug={slug} query={query}/>
        </Suspense>
      )
    case 'about':
      return (
        // Suspense is not support when Javascript is disabled!
        // <Suspense fallback={<ContentLoader />}>
        <AboutOrganisation />
        // </Suspense>
      )
    default:
      logger(`Unknown tab_id ${tab}...returning 404 page`,'warn')
      return notFound()
  }

}
