import Head from 'next/head'

import DefaultLayout from '../components/layout/DefaultLayout'
import Typography from '@mui/material/Typography'

export default function SoftwareIndexPage() {
  return (
    <>
    <Head>
      <title>About page | Research Software Directory</title>
    </Head>
    <DefaultLayout>
      <Typography variant="h1">About page</Typography>
    </DefaultLayout>
    </>
  )
}