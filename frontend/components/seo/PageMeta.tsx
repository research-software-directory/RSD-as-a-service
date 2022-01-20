import Head from 'next/head'

import {SoftwareItem} from '../../types/SoftwareItem'

export default function SoftwarePageMeta({title, description}:
  { title: string, description:string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  )
}
