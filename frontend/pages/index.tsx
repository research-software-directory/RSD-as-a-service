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
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eligendi, magnam eaque quas necessitatibus in eius suscipit numquam dolorem cumque nulla recusandae debitis, deserunt ipsam distinctio quaerat illum. Provident, quos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eligendi, magnam eaque quas necessitatibus in eius suscipit numquam dolorem cumque nulla recusandae debitis, deserunt ipsam distinctio quaerat illum. Provident, quos.</p>
      </DefaultLayout>
    </>
  )
}
