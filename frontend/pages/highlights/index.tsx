// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next/types'
import useMediaQuery from '@mui/material/useMediaQuery'
import Pagination from '@mui/material/Pagination'

import {app} from '~/config/app'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {getSoftwareList} from '~/utils/getSoftware'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import MainContent from '~/components/layout/MainContent'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import SoftwareFiltersPanel from '~/components/software/overview/SoftwareFiltersPanel'
import SoftwareHighlights from '~/components/software/highlights/SoftwareHighlights'
import OverviewPageBackground from '~/components/software/overview/PageBackground'
import SearchSection, {LayoutType} from '~/components/software/overview/SearchSection'
import useSoftwareParams from '~/components/software/overview/useSoftwareParams'
import SoftwareOverviewContent from '~/components/software/overview/SoftwareOverviewContent'
import SoftwareFilters from '~/components/software/overview/filters/index'
import {
  KeywordFilterOption, LanguagesFilterOption, LicensesFilterOption,
  softwareKeywordsFilter, softwareLanguagesFilter,
  softwareLicesesFilter
} from '~/components/software/overview/filters/softwareFiltersApi'
import FilterModal from '~/components/software/overview/filters/FilterModal'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {getUserSettings, setDocumentCookie} from '~/components/software/overview/userSettings'
import {SoftwareHighlight, getSoftwareHighlights} from '~/components/admin/software-highlights/apiSoftwareHighlights'


type SoftwareHighlightsPageProps = {
  search?: string
  keywords?: string[],
  keywordsList: KeywordFilterOption[],
  prog_lang?: string[],
  languagesList: LanguagesFilterOption[],
  licenses?: string[],
  licensesList: LicensesFilterOption[],
  order: string,
  page: number,
  rows: number,
  count: number,
  layout: LayoutType,
  software: SoftwareListItem[],
  highlights: SoftwareHighlight[]
}

const pageTitle = `Software | ${app.title}`
const pageDesc = 'The list of research software registerd in the Research Software Directory.'

export default function SoftwareHighlightsPage({
  search, keywords,
  prog_lang, licenses,
  order, page, rows,
  count, layout,
  keywordsList, languagesList,
  licensesList, software, highlights
}: SoftwareHighlightsPageProps) {
  const [view, setView] = useState<LayoutType>('masonry')
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {handleQueryChange, resetFilters} = useSoftwareParams()

  const [modal,setModal] = useState(false)
  const numPages = Math.ceil(count / rows)
  const filterCnt = getFilterCount()

  // console.group('SoftwareHighlightsPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('order...', order)
  // console.log('layout...', layout)
  // console.log('view...', view)
  // console.log('software...', software)
  // console.log('highlights...', highlights)
  // console.groupEnd()

  // Update view state based on layout value from cookie
  useEffect(() => {
    if (layout) {
      setView(layout)
    }
  },[layout])

  function getFilterCount() {
    let count = 0
    if (order) count++
    if (keywords) count++
    if (prog_lang) count++
    if (licenses) count++
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
      <OverviewPageBackground>
        {/* App header */}
        <AppHeader />
        {/* Software Highlights Carousel */}
        <SoftwareHighlights highlights={highlights} />
        {/* Main page body */}
        <MainContent className='pb-12'>
          {/* Page title */}
          <h1
            className="my-4 text-2xl"
            id="list-top"
          >
            All software
          </h1>
          {/* Page grid with 2 sections: left filter panel and main content */}
          <div className="flex-1 flex w-full my-4 gap-8">
            {/* Filters panel large screen */}
            {smallScreen===false &&
              <SoftwareFiltersPanel>
                <SoftwareFilters
                  keywords={keywords ?? []}
                  keywordsList={keywordsList}
                  languages={prog_lang ?? []}
                  languagesList={languagesList}
                  licenses={licenses ?? []}
                  licensesList={licensesList}
                  orderBy={order ?? ''}
                  filterCnt={filterCnt}
                  resetFilters={resetFilters}
                  handleQueryChange={handleQueryChange}
                />
              </SoftwareFiltersPanel>
            }
            {/* Search & main content section */}
            <div className="flex-1">
              <SearchSection
                page={page}
                rows={rows}
                count={count}
                search={search}
                placeholder={keywords?.length ? 'Find within selection' : 'Find software'}
                layout={view}
                resetFilters={resetFilters}
                setView={setLayout}
                setModal={setModal}
                handleQueryChange={handleQueryChange}
              />
              {/* Software content: cards or list */}
              <SoftwareOverviewContent
                layout={view}
                software={software}
              />
              {/* Pagination */}
              <div className="flex justify-center mt-8">
                {numPages > 1 &&
                  <Pagination
                    count={numPages}
                    page={page}
                    onChange={(_, page) => {
                      handleQueryChange('page',page.toString())
                    }}
                  />
                }
              </div>
            </div>
          </div>
        </MainContent>
        <AppFooter />
      </OverviewPageBackground>
      {/* filter for mobile */}
      {
        smallScreen===true &&
        <FilterModal
          open={modal}
          keywords={keywords ?? []}
          keywordsList={keywordsList}
          prog_lang={prog_lang ?? []}
          languagesList={languagesList}
          licenses={licenses ?? []}
          licensesList={licensesList}
          order={order ?? ''}
          // setOrderBy={setOrderBy}
          filterCnt={filterCnt}
          resetFilters={resetFilters}
          handleQueryChange={handleQueryChange}
          setModal={setModal}
        />
      }
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let orderBy, offset=0
  // extract params from page-query
  const {search, keywords, prog_lang, licenses, order, rows, page} = ssrSoftwareParams(context.query)
  // extract user settings from cookie
  const {rsd_page_layout, rsd_page_rows} = getUserSettings(context.req)
  // default rows values comes from user settings
  let page_rows = rsd_page_rows

  if (order) {
    orderBy=`${order}.desc.nullslast`
  }
  // if rows && page are provided as query params
  if (rows && page) {
    offset = rows * (page - 1)
    // use rows provided as param
    page_rows = rows
  }
  // construct postgREST api url with query params
  const url = softwareListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    licenses,
    prog_lang,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // console.log('software...url...', url)
  // console.log('search...', search)
  // console.log('page_rows...', page_rows)

  // get software items AND filter options
  const [
    software,
    keywordsList,
    languagesList,
    licensesList,
    {highlights}
  ] = await Promise.all([
    getSoftwareList({url}),
    softwareKeywordsFilter({search, keywords, prog_lang, licenses}),
    softwareLanguagesFilter({search, keywords, prog_lang, licenses}),
    softwareLicesesFilter({search, keywords, prog_lang, licenses}),
    getSoftwareHighlights({
      page: 0,
      // get max. 20 items
      rows: 20,
      orderBy: 'position'
    })
  ])

  // is passed as props to page
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
      page,
      order,
      rows: page_rows,
      layout: rsd_page_layout,
      count: software.count,
      software: software.data,
      highlights
    },
  }
}