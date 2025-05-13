// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import {app} from '~/config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import RsdInvitePage from '~/components/admin/rsd-invites'

const pageTitle = `${adminPages['rsd_invites'].title} | Admin page | ${app.title}`

export default function AdminRsdInvitePage() {
  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['rsd_invites'].title}>
        <RsdInvitePage />
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
