// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import {app} from '../../config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import AdminSoftwareHighlight from '~/components/admin/software-highlights/index'

const pageTitle = `${adminPages['softwareHighlights'].title} | Admin page | ${app.title}`

export default function AdminSoftwareHighlightsPage() {

  // console.group('AdminOrganisationsPage')
  // console.log('domains...', domains)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['softwareHighlights'].title}>
        <AdminSoftwareHighlight />
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
