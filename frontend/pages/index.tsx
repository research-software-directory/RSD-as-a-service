import Head from 'next/head'

import Typography from '@mui/material/Typography'
import DefaultLayout from '../components/layout/DefaultLayout'

export default function Home(){
  return (
    <>
    <Head>
      <title>Home page | Research Software Directory</title>
    </Head>
    <DefaultLayout>
      <h1>Home page</h1>
    </DefaultLayout>
    </>
  )
}
