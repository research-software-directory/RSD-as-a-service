// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {app} from '../../config/app'
import {adminPages} from '~/components/admin/AdminNav'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import Head from 'next/head'
import AdminRsdContributors from '~/components/admin/rsd-contributors'

const pageTitle = `${adminPages['contributors'].title} | Admin page | ${app.title}`

const pagination = {
  count: 0,
  page: 0,
  rows: 12,
  rowsOptions: [12,24,48],
  labelRowsPerPage:'Per page'
}

export default function AdminContributorsPage() {
  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['contributors'].title}>
        <SearchProvider>
          <PaginationProvider pagination={pagination}>
            <AdminRsdContributors />
          </PaginationProvider>
        </SearchProvider>
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
