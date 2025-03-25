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
import {highlightsListUrl} from '~/utils/postgrestUrl'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getSoftwareList} from '~/utils/getSoftware'
import {getUserSettings, setDocumentCookie} from '~/utils/userSettings'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import useRsdSettings from '~/config/useRsdSettings'
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
import SoftwareSearchSection from '~/components/software/overview/search/SoftwareSearchSection'
import useSoftwareOverviewParams from '~/components/software/overview/useSoftwareOverviewParams'
import SoftwareOverviewContent from '~/components/software/overview/SoftwareOverviewContent'
import SoftwareFilters from '~/components/software/overview/filters/index'
import {
  highlightKeywordsFilter,
  highlightLanguagesFilter,
  highlightLicensesFilter,
  softwareCategoriesFilter,
} from '~/components/software/overview/filters/softwareFiltersApi'
import SoftwareFiltersModal from '~/components/software/overview/filters/SoftwareFiltersModal'
import {highlightOrderOptions} from '~/components/software/overview/filters/OrderSoftwareBy'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {CategoryOption} from '~/components/filter/CategoriesFilter'

type SpotlightsOverviewProps = {
  search?: string | null
  keywords?: string[] | null,
  keywordsList: KeywordFilterOption[],
  prog_lang?: string[] | null,
  languagesList: LanguagesFilterOption[],
  licenses?: string[] | null,
  licensesList: LicensesFilterOption[],
  categories?: string[] | null,
  categoriesList?: CategoryOption[]
  order?: string | null,
  page: number,
  rows: number,
  count: number,
  layout: LayoutType,
  highlights: SoftwareOverviewItemProps[]
}

const pageTitle = `Software | ${app.title}`
const pageDesc = 'The list of research software registered in the Research Software Directory.'

export default function SpotlightsOverviewPage({
  search, keywords,
  prog_lang, licenses,
  order, page, rows,
  count, layout,
  keywordsList, languagesList,
  categories, categoriesList,
  licensesList, highlights
}: SpotlightsOverviewProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {createUrl} = useSoftwareOverviewParams()
  const [modal,setModal] = useState(false)
  const {host} = useRsdSettings()
  // if no layout - default is masonry
  const initView = layout ?? 'masonry'
  const [view, setView] = useState<LayoutType>(initView)
  const numPages = Math.ceil(count / rows)
  const filterCnt = getFilterCount()

  // console.group('SpotlightsOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('order...', order)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('layout...', layout)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('software...', highlights)
  // console.log('categories...', categories)
  // console.log('categoriesList...', categoriesList)
  // console.groupEnd()

  function getFilterCount() {
    let count = 0
    if (keywords) count++
    if (prog_lang) count++
    if (licenses) count++
    if (categories) count++
    if (search) count++
    return count
  }

  function setLayout(view: LayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
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
        {/* Main page body */}
        <MainContent className='pb-12'>
          {/* Page title */}
          <h1
            className="mt-8"
            id="list-top"
            role="heading"
          >
            All {host.software_highlights?.title}
          </h1>
          {host.software_highlights?.description &&
            <p>{host.software_highlights?.description}</p>
          }
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
                  orderBy={order ?? ''}
                  filterCnt={filterCnt}
                  highlightsOnly={true}
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
                placeholder={keywords?.length ? 'Find within selection' : `Find ${host.software_highlights?.title}`}
                layout={view}
                setView={setLayout}
                setModal={setModal}
              />
              {/* Software content: masonry, cards or list */}
              <SoftwareOverviewContent
                layout={view}
                software={highlights}
              />
              {/* Pagination */}
              <div className="flex justify-center mt-8">
                {numPages > 1 &&
                  <Pagination
                    count={numPages}
                    page={page}
                    renderItem={item => {
                      if (item.page !== null) {
                        return (
                          <Link href={createUrl('page', item.page.toString())}>
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
          order={order ?? ''}
          filterCnt={filterCnt}
          setModal={setModal}
        />
      }
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let orderBy='slug.asc', offset=0
  // extract params from page-query
  const {search, keywords, prog_lang, licenses, categories, order, rows, page} = ssrSoftwareParams(context.query)
  // extract user settings from cookie
  const {rsd_page_layout, rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }

  if (order) {
    // extract order direction from definitions
    const orderInfo = highlightOrderOptions.find(item=>item.key===order)
    // ordering options require "stable" secondary order
    // to ensure proper pagination. We use slug for this purpose
    if (orderInfo) orderBy=`${order}.${orderInfo.direction},slug.asc`
  }

  // construct postgREST api url with query params
  const url = highlightsListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    licenses,
    prog_lang,
    categories,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // console.log('software...url...', url)
  // console.log('order...', order)
  // console.log('orderBy...', orderBy)
  // console.log('page_rows...', page_rows)

  // get software items, filter options AND highlights
  const [
    highlights,
    keywordsList,
    languagesList,
    licensesList,
    categoriesList
  ] = await Promise.all([
    getSoftwareList({url}),
    highlightKeywordsFilter({search, keywords, prog_lang, licenses, categories}),
    highlightLanguagesFilter({search, keywords, prog_lang, licenses, categories}),
    highlightLicensesFilter({search, keywords, prog_lang, licenses, categories}),
    softwareCategoriesFilter({search, keywords, prog_lang, licenses, categories},'highlight_category_filter')
  ])

  // passed as props to the page
  // see params of page function
  return {
    props: {
      search,
      keywords,
      keywordsList,
      prog_lang,
      languagesList,
      licenses,
      licensesList,
      categories,
      categoriesList,
      page,
      order,
      rows: page_rows,
      layout: rsd_page_layout,
      count: highlights.count,
      highlights: highlights.data,
    },
  }
}
