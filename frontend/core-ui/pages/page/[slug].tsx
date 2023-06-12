// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {ssrMarkdownPage} from '~/components/admin/pages/useMarkdownPages'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import MarkdownPage from '~/components/layout/MarkdownPage'

export default function PublicPage({title,markdown}: {title:string, markdown: string }) {
  const pageTitle=`${title} | ${app.title}`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AppHeader/>
      <MarkdownPage markdown={markdown} />
      <AppFooter/>
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.params?.slug?.toString()
  // call ssr method which returns 404 or markdown props
  return await ssrMarkdownPage(slug)
}
