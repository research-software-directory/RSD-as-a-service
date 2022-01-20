
import Head from 'next/head'

export default function CanoncialUrl({canonicalUrl}:{canonicalUrl: string }) {
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl}/>
    </Head>
  )
}
