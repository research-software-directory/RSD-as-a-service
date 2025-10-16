// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import {getUserFromToken} from '~/auth/getSessionServerSide'
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {getOrganisationIdForSlug, getProjectsForOrganisation} from '~/components/organisation/apiOrganisations'
import OrgSearchProjectSection from './search/OrgSearchProjectSection'
import {getOrganisationProjectsOrder} from './filters/OrgProjectOrderOptions'
import OrgProjectFilters from './filters'
import OrganisationProjectsOverview from './OrganisationProjectsOverview'

type OrganisationProjectsTabProps = Readonly<{
  slug: string[],
  query: {[key: string]: string | undefined}
}>

export default async function OrganisationProjects({slug,query}:OrganisationProjectsTabProps) {
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

  const params = ssrProjectsParams(query)
  const rows = params.rows ?? rsd_page_rows

  // build order query, default order is pinned (is_featured)
  const orderBy=getOrganisationProjectsOrder(isMaintainer,params?.order)

  const projects = await getProjectsForOrganisation({
    organisation: uuid,
    searchFor: params?.search ?? undefined,
    project_status: params?.project_status ?? undefined,
    keywords: params.keywords,
    domains: params.domains,
    organisations: params.organisations,
    categories: params.categories,
    order: orderBy,
    // api works with zero
    page: params.page ? params.page-1 : 0,
    rows,
    isMaintainer,
    token
  })

  const numPages = Math.ceil(projects.count / rows)

  // console.group('OrganisationProjects')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('uuid...', uuid)
  // console.log('params...', params)
  // console.log('count...', projects.count)
  // console.log('projects...', projects.data)
  // console.log('numPages...', numPages)
  // console.log('rows...', rows)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  return (
    <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
      {/* Filters panel large screen */}
      <FiltersPanel>
        <OrgProjectFilters />
      </FiltersPanel>

      {/* Search & main content section */}
      <div className="flex-1">
        <OrgSearchProjectSection
          count={projects.count}
        />
        {/* Project overview/content */}
        <OrganisationProjectsOverview
          projects={projects.data}
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
