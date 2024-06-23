// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
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
import OrganisationsPage from '~/components/admin/organisations/index'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'

const pageTitle = `${adminPages['organisations'].title} | Admin page | ${app.title}`

const pagination = {
  count: 0,
  page: 0,
  rows: 12,
  rowsOptions: rowsPerPageOptions,
  labelRowsPerPage:'Per page'
}

export default function AdminOrganisationsPage() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  pagination.rows = rsd_page_rows ?? rowsPerPageOptions[0]
  // console.group('AdminOrganisationsPage')
  // console.log('domains...', domains)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['organisations'].title}>
        <SearchProvider>
          <PaginationProvider pagination={pagination}>
            <OrganisationsPage />
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

//     // get links to all pages server side
//     // const links = await getPageLinks({is_published: false, token})

//     return {
//       // passed to the page component as props
//       props: {
//         domains:[]
//       },
//     }
//   }catch(e){
//     return {
//       notFound: true,
//     }
//   }
// }
