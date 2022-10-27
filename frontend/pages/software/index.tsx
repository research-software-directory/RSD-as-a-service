// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent, useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {GetServerSidePropsContext} from 'next/types'
import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import {SoftwareListItem} from '~/types/SoftwareTypes'

import {app} from '~/config/app'
import SoftwareKeywordFilter from '~/components/software/SoftwareKeywordFilter'
import {rowsPerPageOptions} from '~/config/pagination'
import {getSoftwareList} from '~/utils/getSoftware'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {softwareListUrl, softwareUrl} from '~/utils/postgrestUrl'

import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import Searchbox from '~/components/form/Searchbox'
import SoftwareGrid from '~/components/software/SoftwareGrid'
import FilterByKeywordsPanel from '~/components/keyword/FilterByKeywordsPanel'
import Button from '@mui/material/Button'

type SoftwareIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  keywords?: string[],
  software: SoftwareListItem[],
  search?: string,
}

const pageTitle = `Software | ${app.title}`

export default function SoftwareIndexPage(
  {software = [], count, page, rows, keywords:selectedKeywords, search}: SoftwareIndexPageProps
) {
  const [openPanel, setOpenPanel] = useState(false)

  // use next router (hook is only for browser)
  const router = useRouter()

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    const url = softwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      page: newPage,
    })
    router.push(url)
  }

  function handlePaginationChange(
    event: ChangeEvent<unknown>,
    newPage: number,
  ) {
    // Pagination component starts counting from 1, but we need to start from 0
    handleTablePageChange(event as any, newPage - 1)
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const url = softwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    router.push(url)
  }

  function handleSearch(searchFor: string) {
    // debugger
    const url = softwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      search: searchFor,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  function handleFilters(keywords: string[]) {
    const url = softwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      keywords,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  // TODO! handle sort options
  // function handleSort(sortOn:string){
  //   logger(`software.index.handleSort: TODO! Sort on...${sortOn}`,'warn')
  // }

  function filterKeywords(keywords: string[]) {
    console.log('🎹 keywords to filter', keywords)
    const url = softwareUrl({keywords})
    router.push(url)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PageTitle title="Software">
        <div className="md:flex flex-wrap justify-end">
          <div className="flex items-center">
            <Searchbox
              placeholder="Filter software"
              onSearch={handleSearch}
              defaultValue={search}
            />
            <SoftwareKeywordFilter
              items={keywords ?? []}
              onApply={handleFilters}
            />
          </div>
          <TablePagination
            component="nav"
            count={count}
            page={page}
            labelRowsPerPage="Per page"
            onPageChange={handleTablePageChange}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleItemsPerPage}
          />
        </div>
      </PageTitle>

      <div className="sm:hidden">
        <Button variant="contained" style={{textTransform: 'capitalize'}}
                onClick={() => setOpenPanel(true)}>Open Filters</Button>
      </div>

      <div className="flex gap-3">

        {/* Filter panel*/}
        <div
          className={`bg-black bg-opacity-0 pointer-events-none fixed top-0 left-0 bottom-0 right-0 h-screen w-screen z-10 ${openPanel && 'bg-opacity-40 pointer-events-auto'}`}
          onClick={() => setOpenPanel(false)}>
        </div>
        <div className={`w-64 fixed -translate-x-72 bg-base-100 top-0 h-full transition-transform duration-300 p-4  
                      sm:relative sm:translate-x-0 sm:left-0 sm:z-auto z-10 shadow-2xl sm:shadow-none
                      ${openPanel && '-translate-x-4'}`}
        >
          <div className="sm:hidden">
            <Button onClick={() => setOpenPanel(false)}>Close</Button>
          </div>
          <FilterByKeywordsPanel keywords={selectedKeywords} onFilterChange={filterKeywords}/>
        </div>

        {/* Grid Software*/}
        <div className="w-full">
          {/*software list*/}
          <SoftwareGrid software={software} className=""/>

          <div className="flex flex-wrap justify-center mt-3 mb-5">
            <Pagination
              count={Math.ceil(count / rows)}
              page={page + 1}
              onChange={handlePaginationChange}
              size="large"
              shape="rounded"
            />
          </div>
        </div>

      </div>

    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract params from page-query
  const {search, keywords, rows, page} = ssrSoftwareParams(context.query)
  // construct postgREST api url with query params
  const url = softwareListUrl({
    baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
    search,
    keywords,
    order: 'mention_cnt.desc.nullslast,contributor_cnt.desc.nullslast,updated_at.desc.nullslast',
    limit: rows,
    offset: rows * page,
  })

  // get software list, we do not pass the token
  // when token is passed it will return not published items too
  const software = await getSoftwareList({url})

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      keywords,
      count: software.count,
      page,
      rows,
      software: software.data,
    },
  }
}
