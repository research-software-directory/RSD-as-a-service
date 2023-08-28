// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import {app} from '../../config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import AnnouncementsPage from '~/components/admin/announcements/index'

const pageTitle = `${adminPages['announcements'].title} | Admin page | ${app.title}`

export default function AdminAnnouncementsPage(props:any) {

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['announcements'].title}>
        <AnnouncementsPage {...props} />
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
