import Head from 'next/head'

import {app} from '../config/app'
import DefaultLayout from '../components/layout/DefaultLayout'

export default function Home(){
  return (
    <>
      <Head>
        <title>Home page | {app.title}</title>
      </Head>
      <DefaultLayout>
        <h1>Home page</h1>
      </DefaultLayout>
    </>
  )
}
