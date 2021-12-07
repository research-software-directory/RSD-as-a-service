import Head from 'next/head'

import DefaultLayout from '../components/layout/DefaultLayout'
import PageTitle from '../components/layout/PageTitle'

export default function SoftwareIndexPage() {
  return (
    <>
    <Head>
      <title>About page | Research Software Directory</title>
    </Head>
    <DefaultLayout>
      <h1>About page</h1>
    </DefaultLayout>
    </>
  )
}