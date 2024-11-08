// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {ssrMarkdownPage} from '~/components/admin/pages/useMarkdownPages'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import PageBackground from '~/components/layout/PageBackground'
import MainContent from '~/components/layout/MainContent'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'

export default function PublicPage({title,markdown}: {title:string, markdown: string }) {
  const pageTitle=`${title} | ${app.title}`
  const description = markdown.split('\n')[0] ?? ''
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={description}
      />
      <OgMetaTags
        title={pageTitle}
        description={description}
      />
      <PageBackground>
        <AppHeader/>
        <MainContent className="lg:w-[64rem] lg:mx-auto pb-12 bg-base-100">
          <ReactMarkdownWithSettings
            className='p-8'
            markdown={markdown}
          />
        </MainContent>
        <AppFooter/>
      </PageBackground>
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
