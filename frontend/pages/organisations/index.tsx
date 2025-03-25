// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import {GetServerSidePropsContext} from 'next/types'
import Link from 'next/link'
import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

import {app} from '~/config/app'
import PageTitle from '~/components/layout/PageTitle'
import Searchbox from '~/components/form/Searchbox'
import {OrganisationList} from '~/types/Organisation'
import {rowsPerPageOptions} from '~/config/pagination'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getOrganisationsList} from '~/components/organisation/apiOrganisations'
import PageMeta from '~/components/seo/PageMeta'
import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import {getUserSettings} from '~/utils/userSettings'
import useSearchParams from '~/components/search/useSearchParams'
import OrganisationGrid from '~/components/organisation/overview/OrganisationGrid'
import PageBackground from '~/components/layout/PageBackground'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import MainContent from '~/components/layout/MainContent'

type OrganisationsOverviewPageProps = {
  count: number,
  page: number,
  rows: number,
  organisations: OrganisationList[],
  search?: string,
}

const pageTitle = `Organisations | ${app.title}`
const pageDesc = 'List of organizations involved in the development of research software.'

export default function OrganisationsOverviewPage({
  organisations = [], count, page, rows, search
}: OrganisationsOverviewPageProps) {
  const {handleQueryChange,createUrl} = useSearchParams('organisations')
  const numPages = Math.ceil(count / rows)

  // console.group('OrganisationsOverviewPage')
  // console.log('search...', search)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('organisations...', organisations)
  // console.groupEnd()

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    // Pagination component starts counting from 0, but we need to start from 1
    handleQueryChange('page',(newPage + 1).toString())
  }
  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    handleQueryChange('rows', event.target.value)
  }

  function handleSearch(searchFor: string) {
    handleQueryChange('search',searchFor)
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
        <AppHeader />

        <MainContent className="py-4">
          {/* Page title with search and pagination */}
          <div className="px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-9">
            <PageTitle title="Organisations">
              <div className="md:flex flex-wrap justify-end">
                <div className="flex items-center lg:ml-4">
                  <Searchbox
                    placeholder='Find organisation'
                    onSearch={handleSearch}
                    defaultValue={search}
                  />
                </div>
                <TablePagination
                  component="nav"
                  count={count}
                  // uses 0 based index
                  page={page>0 ? page-1 : 0}
                  labelRowsPerPage="Items"
                  onPageChange={handleTablePageChange}
                  rowsPerPage={rows}
                  rowsPerPageOptions={rowsPerPageOptions}
                  onRowsPerPageChange={handleItemsPerPage}
                />
              </div>
            </PageTitle>
          </div>

          {/* Organizations cards */}
          <OrganisationGrid
            organisations={organisations}
          />

          {/* Pagination */}
          {numPages > 1 &&
            <div className="flex flex-wrap justify-center mb-10">
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
            </div>
          }
        </MainContent>

        {/* App footer */}
        <AppFooter />
      </PageBackground >
    </>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract params from page-query
  // extract rsd_token
  const {req} = context
  const {search, rows, page} = ssrBasicParams(context.query)
  const token = req?.cookies['rsd_token']
  // extract user settings from cookie
  const {rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows

  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('page_rows...', page_rows)

  const {count, data} = await getOrganisationsList({
    search,
    rows: page_rows,
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    token,
  })

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      count,
      page,
      rows: page_rows,
      organisations: data,
    }
  }
}
