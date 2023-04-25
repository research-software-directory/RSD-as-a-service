// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Pagination from '@mui/material/Pagination'
import Button from '@mui/material/Button'

import SoftwareFiltersPanel from '~/components/software/overview/SoftwareFiltersPanel'
import SearchInput from '~/components/software/overview/SearchInput'
import SoftwareHighlights from '~/components/software/highlights/SoftwareHighlights'
import OverviewPageBackground from '~/components/software/overview/PageBackground'
import SoftwareOverviewGrid from '~/components/software/overview/SoftwareOverviewGrid'
import MainContent from '~/components/layout/MainContent'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import SoftwareFilters from '~/components/software/overview/filters/index'
import useSoftwareOverview from '~/components/software/overview/useSoftwareOverview'
import {GetServerSidePropsContext} from 'next/types'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {getSoftwareList} from '~/utils/getSoftware'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {
  KeywordFilterOption, LanguagesFilterOption, LicensesFilterOption,
  softwareKeywordsFilter, softwareLanguagesFilter,
  softwareLicesesFilter
} from '~/components/software/overview/filters/softwareFiltersApi'

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
  software: SoftwareListItem[],
}

export default function SoftwareHighlightsPage({
  search, keywords,
  prog_lang, licenses,
  order, page, rows,
  count, software,
  keywordsList, languagesList,
  licensesList
}:SoftwareHighlightsPageProps) {
  // const router = useRouter()
  const smallScreen = useMediaQuery('(max-width:640px)')
  // const page = router.query.page ? parseInt(router.query.page as string) + 1 : 1
  const {
    handleQueryChange, resetFilters,setOrderBy
  } = useSoftwareOverview()

  const [modal,setModal] = useState(false)
  const numPages = Math.ceil(count / rows)

  console.group('SoftwareHighlightsPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  console.log('keywordsList...', keywordsList)
  // console.log('prog_lang...', prog_lang)
  console.log('languagesList...', languagesList)
  // console.log('licenses...', licenses)
  console.log('licensesList...', licensesList)
  // console.log('order...', order)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('software...', software)
  // console.log('smallScreen...', smallScreen)
  console.groupEnd()

  function getFilterCount() {
    let count = 0
    if (order) count++
    if (keywords) count++
    if (prog_lang) count++
    if (licenses) count++
    if (search) count++
    return count
  }

  return (
    <OverviewPageBackground>
      <AppHeader />
      {/* Software Highlights Carousel */}
      <SoftwareHighlights />
      {/* Main page body */}
      <MainContent className='pb-12'>
        {/* All software */}
        <h1 className="my-4 text-2xl">
          All software
        </h1>
        {/* Filter panel & content panel */}
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
                setOrderBy={setOrderBy}
                getFilterCount={getFilterCount}
                resetFilters={resetFilters}
                handleQueryChange={handleQueryChange}
              />
            </SoftwareFiltersPanel>
          }
          {/* Search & card grid section */}
          <div className="flex-1">
            <SearchInput
              placeholder={keywords?.length ? 'Find within selection' : 'Find software'}
              onSearch={(search: string) => handleQueryChange('search', search)}
              defaultValue={search ?? ''}
            />
            {/* Filter button for mobile */}
            {smallScreen === true &&
              <Button
                onClick={() => setModal(true)}
                variant="outlined"
                sx={{
                  marginTop:'1rem'
                }}
              >
                Filters
              </Button>
            }
            <div className="text-sm opacity-70 py-4">
              page {page ?? 1} of {count} results.
              {/* Only show when filters are applied, and not just sorted */}
              {
                (order !== '' && getFilterCount() > 1) || (order === '' && getFilterCount() > 0) && <a onClick={() => { resetFilters() }} className="underline pl-2">Clear filters</a>
              }
            </div>
            {/* Software Cards Grid */}
            <SoftwareOverviewGrid
              software={software}
            />
            {/* Pagination */}
            <div className="flex justify-center mt-10">
              {numPages > 1 &&
                <Pagination
                  count={numPages}
                  page={page}
                  onChange={(_, page) => {
                    // api uses 0 index
                    // const param = (page - 1).toString()
                    handleQueryChange('page',page.toString())
                  }}
                />
              }
            </div>
          </div>
        </div>
      </MainContent>
      <AppFooter />
      {/* MODAL filter for mobile */}
      {
        smallScreen===true &&
        <Dialog
          fullScreen={smallScreen}
          open={modal}
          aria-labelledby="filters-panel"
          aria-describedby="filters-panel-responsive"
        >
          <DialogTitle sx={{
            fontSize: '1.5rem',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'primary.main',
            fontWeight: 500
          }}>
            Filters
          </DialogTitle>
          <DialogContent>
            <div className="flex p-8 shadow rounded-md flex-col gap-8">
              <SoftwareFilters
                keywords={keywords ?? []}
                keywordsList={keywordsList}
                languages={prog_lang ?? []}
                languagesList={languagesList}
                licenses={licenses ?? []}
                licensesList={licensesList}
                orderBy={order ?? ''}
                setOrderBy={setOrderBy}
                getFilterCount={getFilterCount}
                resetFilters={resetFilters}
                handleQueryChange={handleQueryChange}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              onClick={()=>setModal(false)}
              color="secondary"
              sx={{marginRight:'2rem'}}
            >
              Cancel
            </Button>
            <Button
              onClick={()=>setModal(false)}
              color="primary"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      }
    </OverviewPageBackground>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let orderBy, offset=0
  // extract params from page-query
  const {search, keywords, prog_lang, licenses, order, rows, page} = ssrSoftwareParams(context.query)
  if (order) {
    orderBy=`${order}.desc.nullslast`
  }
  if (rows && page) {
    offset = rows * (page-1)
  }
  // construct postgREST api url with query params
  const url = softwareListUrl({
    baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
    search,
    keywords,
    licenses,
    prog_lang,
    order: orderBy,
    limit: rows,
    offset
  })

  // console.log('software...url...', url)
  // console.log('search...', search)

  // get software list, we do not pass the token
  // when token is passed it will return not published items too
  // const software = await getSoftwareList({url})

  const [
    software,
    keywordsList,
    languagesList,
    licensesList
  ] = await Promise.all([
    getSoftwareList({url}),
    softwareKeywordsFilter({search, keywords, prog_lang, licenses}),
    softwareLanguagesFilter({search, keywords, prog_lang, licenses}),
    softwareLicesesFilter({search, keywords, prog_lang, licenses}),
  ])

  // console.log('getServerSideProps...keywordsList...', keywordsList)
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
      rows,
      order,
      count: software.count,
      software: software.data,
    },
  }
}
