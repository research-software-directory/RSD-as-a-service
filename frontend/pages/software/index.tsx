// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {GetServerSidePropsContext} from 'next/types'
import useMediaQuery from '@mui/material/useMediaQuery'
import Pagination from '@mui/material/Pagination'
import Link from 'next/link'
import PaginationItem from '@mui/material/PaginationItem'

import {app} from '~/config/app'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {getSoftwareList} from '~/utils/getSoftware'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/utils/userSettings'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import MainContent from '~/components/layout/MainContent'
import PageBackground from '~/components/layout/PageBackground'
import FiltersPanel from '~/components/filter/FiltersPanel'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {
  SoftwareHighlight,
  getSoftwareHighlights
} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import SoftwareHighlights from '~/components/software/overview/SoftwareHighlights'
import SoftwareSearchSection from '~/components/software/overview/search/SoftwareSearchSection'
import useSoftwareOverviewParams from '~/components/software/overview/useSoftwareOverviewParams'
import SoftwareOverviewContent from '~/components/software/overview/SoftwareOverviewContent'
import SoftwareFilters from '~/components/software/overview/filters/index'
import {
  softwareCategoriesFilter,
  softwareKeywordsFilter,
  softwareLanguagesFilter,
  softwareLicensesFilter,
  softwareRsdHostsFilter
} from '~/components/software/overview/filters/softwareFiltersApi'
import SoftwareFiltersModal from '~/components/software/overview/filters/SoftwareFiltersModal'
import {softwareOrderOptions} from '~/components/software/overview/filters/OrderSoftwareBy'
import {getRsdSettings} from '~/config/getSettingsServerSide'
import {useUserSettings} from '~/config/UserSettingsContext'
import {HostsFilterOption} from '~/components/filter/RsdHostFilter'
import {getRemoteRsd} from '~/components/admin/remote-rsd/apiRemoteRsd'
import {CategoryOption} from '~/components/filter/CategoriesFilter'

type SoftwareOverviewProps = {
  search?: string | null
  keywords?: string[] | null,
  keywordsList: KeywordFilterOption[],
  prog_lang?: string[] | null,
  languagesList: LanguagesFilterOption[],
  licenses?: string[] | null,
  licensesList: LicensesFilterOption[],
  categories?: string[] | null,
  categoriesList?: CategoryOption[]
  rsd_host?: string,
  hostsList: HostsFilterOption[]
  order: string,
  page: number,
  rows: number,
  count: number,
  software: SoftwareOverviewItemProps[],
  highlights: SoftwareHighlight[],
  hasRemotes: boolean
}

const pageTitle = `Software | ${app.title}`
const pageDesc = 'The list of research software registered in the Research Software Directory.'

export default function SoftwareOverviewPage({
  search, keywords,
  prog_lang, licenses,
  rsd_host, order, page,
  rows, count,
  keywordsList, languagesList,
  categories, categoriesList,
  licensesList, hostsList,
  software, highlights, hasRemotes
}: SoftwareOverviewProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {createUrl} = useSoftwareOverviewParams()
  const {rsd_page_layout,setPageLayout} = useUserSettings()
  const [modal,setModal] = useState(false)
  const numPages = Math.ceil(count / rows)
  const filterCnt = getFilterCount()

  // console.group('SoftwareOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('rsd_host...', rsd_host)
  // console.log('order...', order)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('hostsList...', hostsList)
  // console.log('categories...', categories)
  // console.log('categoriesList...', categoriesList)
  // console.log('software...', software)
  // console.log('highlights...', highlights)
  // console.log('hasRemotes...', hasRemotes)
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

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* canonical url meta tag */}
      <CanonicalUrl />
      <PageBackground>
        {/* App header */}
        <AppHeader />
        {/* Software Highlights Carousel */}
        <SoftwareHighlights highlights={highlights} />
        {/* Main page body */}
        <MainContent className='pb-12'>
          {/* Page title */}
          <h1
            className="mt-8"
            id="list-top"
            role="heading"
          >
            All software
          </h1>
          {/* Page grid with 2 sections: left filter panel and main content */}
          <div className="flex-1 grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] my-4 gap-8">
            {/* Filters panel large screen */}
            {smallScreen===false &&
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
                  rsd_host={rsd_host}
                  hostsList={hostsList}
                  orderBy={order}
                  filterCnt={filterCnt}
                  hasRemotes={hasRemotes}
                />
              </FiltersPanel>
            }
            {/* Search & main content section */}
            <div className="flex-1">
              <SoftwareSearchSection
                page={page}
                rows={rows}
                count={count}
                search={search}
                placeholder={keywords?.length ? 'Find within selection' : 'Find software'}
                layout={rsd_page_layout}
                setView={setPageLayout}
                setModal={setModal}
              />
              {/* Software content: masonry, cards or list */}
              <SoftwareOverviewContent
                layout={rsd_page_layout}
                software={software}
                hasRemotes={hasRemotes}
              />
              {/* Pagination */}
              <div className="flex justify-center mt-8">
                {numPages > 1 &&
                  <Pagination
                    count={numPages}
                    page={page}
                    renderItem={item => {
                      if (item.page !== null) {
                        const url = createUrl('page', item.page.toString())
                        return (
                          <Link href={url}>
                            <PaginationItem {...item}/>
                          </Link>
                        )
                      } else {
                        return (
                          <PaginationItem {...item}/>
                        )
                      }
                    }}
                  />
                }
              </div>
            </div>
          </div>
        </MainContent>
        <AppFooter />
      </PageBackground>
      {/* filter for mobile */}
      {
        smallScreen===true &&
        <SoftwareFiltersModal
          open={modal}
          keywords={keywords ?? []}
          keywordsList={keywordsList}
          prog_lang={prog_lang ?? []}
          languagesList={languagesList}
          licenses={licenses ?? []}
          licensesList={licensesList}
          categories={categories ?? []}
          categoryList={categoriesList ?? []}
          rsd_host={rsd_host}
          hostsList={hostsList}
          order={order ?? ''}
          filterCnt={filterCnt}
          setModal={setModal}
          hasRemotes={hasRemotes}
        />
      }
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let offset=0
  // extract params from page-query
  const {search, keywords, prog_lang, licenses, categories, rsd_host, order, rows, page} = ssrSoftwareParams(context.query)
  // extract user settings from cookie
  const {rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }

  const allowedOrderings = softwareOrderOptions.map(o => o.key)
  // default order
  let softwareOrder = order ?? 'mention_cnt'
  // remove order key if NOT in list of allowed
  if (order && allowedOrderings.includes(order)===false) {
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

  // extract rsd settings
  const settings = await getRsdSettings()

  // console.log('software...url...', url)
  // console.log('rsd_host...', rsd_host)
  // console.log('search...', search)
  // console.log('order...', order)
  // console.log('orderBy...', orderBy)
  // console.log('page_rows...', page_rows)

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
    page !== 1 ? Promise.resolve({highlights: []}) : getSoftwareHighlights({
      limit: settings.host?.software_highlights?.limit ?? 3,
      offset: 0
    })
  ])

  // console.log('software...', software)

  // return page properties
  const props:SoftwareOverviewProps={
    search,
    keywords,
    keywordsList,
    prog_lang,
    languagesList,
    licenses,
    licensesList,
    categories,
    categoriesList,
    hostsList,
    page: page ?? 0,
    order: softwareOrder,
    rows: page_rows,
    count: software.count ?? 0,
    software: software.data,
    highlights,
    hasRemotes: remotesCount > 0
  }

  // add rsd_host if not undefined
  if (rsd_host){
    props['rsd_host']=rsd_host
  }

  return {
    props
  }
}
