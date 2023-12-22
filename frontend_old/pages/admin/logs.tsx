// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {app} from '../../config/app'
import {adminPages} from '~/components/admin/AdminNav'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import AdminLogs from '~/components/admin/logs'

const pageTitle = `${adminPages['logs'].title} | Admin page | ${app.title}`

const pagination = {
  count: 0,
  page: 0,
  rows: 12,
  rowsOptions: [12,24,48],
  labelRowsPerPage:'Per page'
}

export default function AdminLogsPage() {
  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['logs'].title}>
        <SearchProvider>
          <PaginationProvider pagination={pagination}>
            <AdminLogs />
          </PaginationProvider>
        </SearchProvider>
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
