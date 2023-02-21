// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {GetServerSidePropsContext} from 'next/types'
import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'

import {app} from '../../config/app'
import DefaultLayout from '../../components/layout/DefaultLayout'
import PageTitle from '../../components/layout/PageTitle'
import Searchbox from '../../components/form/Searchbox'
import SoftwareGrid from '../../components/software/SoftwareGrid'
import {SoftwareListItem} from '../../types/SoftwareTypes'
import {rowsPerPageOptions} from '../../config/pagination'
import {getSoftwareList} from '../../utils/getSoftware'
import {ssrSoftwareParams} from '../../utils/extractQueryParam'
import {softwareListUrl,ssrSoftwareUrl} from '../../utils/postgrestUrl'
import SoftwareFilter from '~/components/software/filter'
import {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'

type SoftwareIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  keywords?: string[],
  prog_lang?: string[],
  software: SoftwareListItem[],
  search?: string,
}

const pageTitle = `Software | ${app.title}`
const pageDesc = 'The list of research software registerd in the Research Software Directory.'

export default function SoftwareIndexPage(
  {software=[], count, page, rows, keywords, prog_lang, search}: SoftwareIndexPageProps
) {
  // use next router (hook is only for browser)
  const router = useRouter()
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions('software')

  // console.group('SoftwareIndexPage')
  // console.log('query...', router.query)
  // console.groupEnd()

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    const url = ssrSoftwareUrl({
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
  ){
    const url = ssrSoftwareUrl({
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
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      search: searchFor,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  function handleFilters({keywords,prog_lang}:{keywords:string[],prog_lang:string[]}){
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      keywords,
      prog_lang,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  // TODO! handle sort options
  // function handleSort(sortOn:string){
  //   logger(`software.index.handleSort: TODO! Sort on...${sortOn}`,'warn')
  // }

  return (
    <DefaultLayout>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* canonical url meta tag */}
      <CanonicalUrl/>
      <PageTitle title="Software">
        <div className="md:flex flex-wrap justify-end">
          <div className="flex items-center">
            <SoftwareFilter
              keywords={keywords ?? []}
              prog_lang={prog_lang ?? []}
              onApply={handleFilters}
            />
            <Searchbox
              placeholder={keywords?.length ? 'Find within selection' : 'Find software'}
              onSearch={handleSearch}
              defaultValue={search}
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

      <SoftwareGrid
        className='gap-[0.125rem] p-[0.125rem] pt-4 pb-12'
        grid={{
          height: itemHeight,
          minWidth,
          maxWidth
        }}
        software={software}
      />

      <div className="flex flex-wrap justify-center mb-5">
        <Pagination
          count={Math.ceil(count/rows)}
          page={page + 1}
          onChange={handlePaginationChange}
          size="large"
          shape="rounded"
        />
      </div>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  // extract params from page-query
  const {search, keywords, prog_lang, rows, page} = ssrSoftwareParams(context.query)
  // construct postgREST api url with query params
  const url = softwareListUrl({
    baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
    search,
    keywords,
    prog_lang,
    order: 'mention_cnt.desc.nullslast,contributor_cnt.desc.nullslast,updated_at.desc.nullslast',
    limit: rows,
    offset: rows * page,
  })

  // console.log('software...url...', url)

  // get software list, we do not pass the token
  // when token is passed it will return not published items too
  const software = await getSoftwareList({url})

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      keywords,
      prog_lang,
      count: software.count,
      page,
      rows,
      software: software.data,
    },
  }
}
