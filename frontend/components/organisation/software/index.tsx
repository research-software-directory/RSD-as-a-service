// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import {getUserFromToken} from '~/auth/getSessionServerSide'
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {getOrganisationIdForSlug, getSoftwareForOrganisation} from '~/components/organisation/apiOrganisations'
import OrgSoftwareFilters from '~/components/organisation/software/filters'
import {getOrganisationSoftwareOrder} from '~/components/organisation/software/filters/OrgSoftwareOrderOptions'
import OrgSearchSoftwareSection from '~/components/organisation/software/search/OrgSearchSoftwareSection'
import OrganisationSoftwareOverview from './OrganisationSoftwareOverview'

type OrganisationSoftwareTabProps = Readonly<{
  slug: string[],
  query: {[key: string]: string | undefined}
}>

export default async function OrganisationSoftware({slug,query}:OrganisationSoftwareTabProps) {
  // extract params, user preferences and active modules
  const [{token,rsd_page_rows},modules] = await Promise.all([
    getUserSettings(),
    getActiveModuleNames()
  ])
  // show 404 page if module is not enabled or slug is missing
  if (
    modules?.includes('organisations')===false ||
    slug.length === 0
  ){
    notFound()
  }
  // resolve slug to organisation id and verify user
  const [uuid, user] = await Promise.all([
    getOrganisationIdForSlug({slug, token}),
    getUserFromToken(token)
  ])
  // show 404 page if organisation id missing
  if (uuid === undefined || uuid === null) {
    notFound()
  }

  // is this user maintainer of this organisation
  const isMaintainer = await isOrganisationMaintainer({
    organisation: uuid,
    account: user?.account,
    role: user?.role,
    token
  })

  const params = ssrSoftwareParams(query)
  const rows = params.rows ?? rsd_page_rows

  // build order query, default order is pinned (is_featured)
  const orderBy=getOrganisationSoftwareOrder(isMaintainer,params?.order)

  const software = await getSoftwareForOrganisation({
    organisation: uuid,
    searchFor: params?.search,
    keywords: params.keywords,
    prog_lang: params.prog_lang,
    licenses: params.licenses,
    categories: params.categories,
    order: orderBy,
    // api works with zero index
    page: params.page ? params.page - 1 : 0,
    isMaintainer,
    rows,
    token
  })
  const numPages = Math.ceil(software.count / rows)

  // console.group('OrganisationSoftware')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('uuid...', uuid)
  // console.log('params...', params)
  // console.log('count...', software.count)
  // console.log('software...', software.data)
  // console.log('numPages...', numPages)
  // console.log('rows...', rows)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  /* Page grid with 2 sections: left filter panel and main content */
  return (
    <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
      {/* Filters panel large screen */}
      <FiltersPanel>
        <OrgSoftwareFilters />
      </FiltersPanel>
      {/* Search & main content section */}
      <div className="flex-1">
        <OrgSearchSoftwareSection
          rows={rows}
          count={software.count}
        />
        {/* software overview/content */}
        <OrganisationSoftwareOverview
          software={software.data}
          isMaintainer={isMaintainer}
        />
        {/* Pagination */}
        <PaginationLinkApp
          count={numPages}
          page={params.page ?? 1}
          className='mt-4'
        />
      </div>
    </div>
  )
}
