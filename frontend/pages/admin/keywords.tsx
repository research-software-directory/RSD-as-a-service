// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import KeywordsPage from '~/components/admin/keywords/KeywordsPage'

const pageTitle = `${adminPages['keywords'].title} | Admin page | ${app.title}`

export default function AdminKeywords(props:any) {

  // console.group('AdminKeywords')
  // console.log('keywords...', keywords)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['keywords'].title}>
        <KeywordsPage {...props} />
      </AdminPageWithNav>
    </DefaultLayout>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {req} = context
    const token = req?.cookies['rsd_token']

    // get links to all pages server side
    // const links = await getPageLinks({is_published: false, token})

    return {
      // passed to the page component as props
      props: {
        keywords:[]
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
