// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'
import {useRouter} from 'next/router'
import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'

import {app} from '../../config/app'
import DefaultLayout from '../../components/layout/DefaultLayout'
import PageTitle from '../../components/layout/PageTitle'
import Searchbox from '../../components/form/Searchbox'
import {ssrOrganisationUrl} from '../../utils/postgrestUrl'
import {OrganisationForOverview} from '../../types/Organisation'
import {rowsPerPageOptions} from '../../config/pagination'
import {ssrOrganisationParams} from '../../utils/extractQueryParam'
import {getOrganisationsList} from '../../utils/getOrganisations'
import OrganisationsGrid from '../../components/organisation/OrganisationGrid'
import PageMeta from '~/components/seo/PageMeta'

type OrganisationsIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  organisations: OrganisationForOverview[],
  search?: string,
}

const pageTitle = `Organisations | ${app.title}`
const pageDesc = 'The list of organisations participating in the development of research software registerd in the Research Software Directory.'

export default function OrganisationsIndexPage({
  organisations = [], count, page, rows, search
}: OrganisationsIndexPageProps){
  // use next router (hook is only for browser)
  const router = useRouter()

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    const url = ssrOrganisationUrl({
      // take existing params from url (query)
      ...ssrOrganisationParams(router.query),
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
    const url = ssrOrganisationUrl({
      // take existing params from url (query)
      ...ssrOrganisationParams(router.query),
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    router.push(url)
  }

  function handleSearch(searchFor:string){
    const url = ssrOrganisationUrl({
      // take existing params from url (query)
      ...ssrOrganisationParams(router.query),
      search: searchFor,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  return (
    <DefaultLayout>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
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
            page={page}
            labelRowsPerPage="Per page"
            onPageChange={handleTablePageChange}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleItemsPerPage}
          />
        </div>
      </PageTitle>

      <OrganisationsGrid
        organisations={organisations}
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
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract params from page-query
  // extract rsd_token
  const {req} = context
  const {search, rows, page} = ssrOrganisationParams(context.query)
  const token = req?.cookies['rsd_token']

  const {count, data} = await getOrganisationsList({
    search,
    rows,
    page,
    token,
  })

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      count,
      page,
      rows,
      organisations: data,
    }
  }
}
