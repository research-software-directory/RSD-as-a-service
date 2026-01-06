// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {softwareOrderOptions} from '~/components/software/overview/filters/softwareOrderOptions'

import {app} from '~/config/app'
import {getActiveModuleNames, getRsdSettings} from '~/config/getSettingsServerSide'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getRemoteRsd} from '~/components/admin/remote-rsd/apiRemoteRsd'
import {getSoftwareHighlights} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import FiltersPanel from '~/components/filter/FiltersPanel'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {getSoftwareList} from '~/components/software/apiSoftware'
import {
  softwareCategoriesFilter,
  softwareKeywordsFilter,
  softwareLanguagesFilter,
  softwareLicensesFilter,
  softwareRsdHostsFilter
} from '~/components/software/overview/filters/softwareFiltersApi'
import SoftwareHighlights from '~/components/software/overview/SoftwareHighlights'
import SoftwareFilters from '~/components/software/overview/filters'
import SoftwareSearchSection from '~/components/software/overview/search/SoftwareSearchSection'
import SoftwareOverviewContent from '~/components/software/overview/SoftwareOverviewContent'

export const metadata: Metadata = {
  title: `Software | ${app.title}`,
  description: 'The list of research software registered in the Research Software Directory.'
}

export default async function SoftwareOverviewPage({
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}>) {

  // extract params, user preferences and active modules
  const [params, {rsd_page_rows},modules,{host}] = await Promise.all([
    searchParams,
    getUserSettings(),
    getActiveModuleNames(),
    getRsdSettings()
  ])

  // show 404 page if module is not enabled
  if (modules?.includes('software')===false){
    notFound()
  }

  // extract params from page-query
  const {
    search, keywords, prog_lang, licenses,
    categories, rsd_host, order, rows, page
  } = ssrSoftwareParams(params)

  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  let offset=0
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }

  const allowedOrderings = softwareOrderOptions.map(o => o.key)
  // default order
  let softwareOrder = order ?? 'mention_cnt'
  // remove order key if NOT in list of allowed
  if (order && !allowedOrderings.includes(order)) {
    softwareOrder = 'mention_cnt'
  }

  // extract order direction from definitions
  const orderInfo = softwareOrderOptions.find(item=>item.key===softwareOrder)!
  // ordering options require "stable" secondary order
  // to ensure proper pagination. We use slug for this purpose
  const orderBy = `${softwareOrder}.${orderInfo.direction},slug.asc`

  // construct postgREST api url with query params
  const url = softwareListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    licenses,
    rsd_host,
    prog_lang,
    categories,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // get software items, filter options AND highlights
  const [
    software,
    keywordsList,
    languagesList,
    licensesList,
    categoriesList,
    hostsList,
    // extract remotes count from fn response
    {count:remotesCount},
    // extract highlights from fn response (we don't need count)
    {highlights}
  ] = await Promise.all([
    getSoftwareList({url}),
    softwareKeywordsFilter({search, keywords, prog_lang, licenses, categories, rsd_host}),
    softwareLanguagesFilter({search, keywords, prog_lang, licenses, categories, rsd_host}),
    softwareLicensesFilter({search, keywords, prog_lang, licenses, categories, rsd_host}),
    softwareCategoriesFilter({search, keywords, prog_lang, licenses, categories, rsd_host}),
    // get sources list based on other filters
    softwareRsdHostsFilter({search, keywords, prog_lang, licenses, categories}),
    // get remotes count
    getRemoteRsd({page:0, rows:1}),
    // highlights only on first page
    page === 1 ? getSoftwareHighlights({
      limit: host?.software_highlights?.limit ?? 3,
      offset: 0
    }) : Promise.resolve({highlights: []})
  ])

  const numPages = Math.ceil(software.count / page_rows)
  const filterCnt = getFilterCount()

  // console.group('SoftwareOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('categories...', categories)
  // console.log('rsd_host...', rsd_host)
  // console.log('order...', orderBy)
  // console.log('page...', page)
  // console.log('rows...', page_rows)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('categoriesList...', categoriesList)
  // console.log('hostsList...', hostsList)
  // console.log('software...', software)
  // console.groupEnd()

  function getFilterCount() {
    let count = 0
    if (keywords) count++
    if (prog_lang) count++
    if (licenses) count++
    if (search) count++
    if (categories) count++
    if (rsd_host) count++
    return count
  }

  return(
    <article className="flex-1 flex flex-col">
      {/* Software Highlights Carousel */}
      <SoftwareHighlights
        title={host.software_highlights?.title ?? 'Highlights'}
        page={page}
        highlights={highlights}
      />
      {/* Page title in the container */}
      <h1 className="mt-8 px-4 lg:container lg:mx-auto" id="list-top">
        All software
      </h1>
      {/* Page grid with 2 sections: left filter panel and main content */}
      <section className="flex-1 px-4 my-4 grid gap-8 md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] lg:container lg:mx-auto xl:grid-cols-[1fr_4fr]">
        {/* Filters panel large screen */}
        <FiltersPanel>
          <SoftwareFilters
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            languages={prog_lang ?? []}
            languagesList={languagesList}
            licenses={licenses ?? []}
            licensesList={licensesList}
            categories={categories ?? []}
            categoryList={categoriesList ?? []}
            rsd_host={rsd_host ?? undefined}
            hostsList={hostsList}
            orderBy={softwareOrder}
            filterCnt={filterCnt}
            hasRemotes={remotesCount > 0}
          />
        </FiltersPanel>
        {/* Search & main content section */}
        <div className="flex-1 flex flex-col">
          <SoftwareSearchSection
            count={software.count}
            filterModal={
              <SoftwareFilters
                keywords={keywords ?? []}
                keywordsList={keywordsList}
                languages={prog_lang ?? []}
                languagesList={languagesList}
                licenses={licenses ?? []}
                licensesList={licensesList}
                categories={categories ?? []}
                categoryList={categoriesList ?? []}
                rsd_host={rsd_host ?? undefined}
                hostsList={hostsList}
                orderBy={softwareOrder}
                filterCnt={filterCnt}
                hasRemotes={remotesCount > 0}
              />
            }
          />
          {/* Software content: masonry, cards or list */}
          <SoftwareOverviewContent
            software={software.data}
            hasRemotes={remotesCount > 0}
          />
          {/* Pagination */}
          <PaginationLinkApp
            count={numPages}
            page={page ?? 1}
            className='mt-4'
          />
        </div>
      </section>
    </article>
  )

}
