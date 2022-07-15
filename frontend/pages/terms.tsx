import Head from 'next/head'

import {app} from '~/config/app'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'
import {ssrMarkdownPage} from '~/components/admin/pages/useMarkdownPages'
import MarkdownPage from '~/components/layout/MarkdownPage'

export default function TermsOfServicePage({title, markdown}: { title: string, markdown: string }) {
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
export async function getServerSideProps() {
  // call ssr method which returns 404 or markdown props
  return await ssrMarkdownPage('terms')
}

