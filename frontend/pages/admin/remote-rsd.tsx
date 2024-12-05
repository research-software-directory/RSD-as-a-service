// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import {app} from '~/config/app'
import {rowsPerPageOptions} from '~/config/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import AdminRemoteRsd from '~/components/admin/remote-rsd'

const pageTitle = `${adminPages['remote_rsd'].title} | Admin page | ${app.title}`

const pagination = {
  count: 0,
  page: 0,
  rows: 12,
  rowsOptions: rowsPerPageOptions,
  labelRowsPerPage:'Per page'
}


export default function AdminRemoteRsdPage() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  pagination.rows = rsd_page_rows ?? rowsPerPageOptions[0]

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['remote_rsd'].title}>
        <SearchProvider>
          <PaginationProvider pagination={pagination}>
            <AdminRemoteRsd />
          </PaginationProvider>
        </SearchProvider>
      </AdminPageWithNav>
    </DefaultLayout>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(context:GetServerSidePropsContext) {
//   try{
//     const {req} = context
//     const token = req?.cookies['rsd_token']
//
//     return {
//       // passed to the page component as props
//       props: {
//         count: resp?.count,
//         communities: resp.communities
//       },
//     }
//   }catch(e){
//     return {
//       notFound: true,
//     }
//   }
// }
