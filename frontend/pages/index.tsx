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
        <section className="py-8">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id accusantium maxime recusandae excepturi earum vel dignissimos laborum, quisquam doloribus magni veniam voluptate voluptatum autem corrupti eveniet? Exercitationem ullam, qui harum veniam autem modi recusandae atque minima ipsa omnis quod odit eos animi repellat a laboriosam in, quam veritatis, pariatur non!</p>
        </section>
      </DefaultLayout>
    </>
  )
}
