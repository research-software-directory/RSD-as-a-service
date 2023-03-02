// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import RsdUsersPage from '~/components/admin/rsd-users/'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'

const pageTitle = `${adminPages['accounts'].title} | Admin page | ${app.title}`

export default function AdminRsdUsersPage() {

  // console.group('AdminRsdUsersPage')
  // console.log('pageTitle...', pageTitle)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['accounts'].title}>
        <SearchProvider>
          <PaginationProvider>
            <RsdUsersPage />
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
//         accounts:[]
//       },
//     }
//   }catch(e){
//     return {
//       notFound: true,
//     }
//   }
// }
