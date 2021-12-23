import Head from 'next/head'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'

// import DefaultLayout from '../../../components/layout/DefaultLayout'
import AppHeader from '../../../components/layout/AppHeader'
import AppFooter from '../../../components/layout/AppFooter'

import SoftwareIntroSection from '../../../components/software/SoftwareIntroSection'
import GetStartedSection from '../../../components/software/GetStartedSection'

import {getSoftwareItem} from '../../../utils/getSoftware'
import {SoftwareItem} from '../../../types/SoftwareItem'

export default function SoftwareIndexPage({software, slug}:{software:SoftwareItem, slug:string}) {
  const router = useRouter()
  const {status} = useSession()
  // console.log("useSession.status...", status)
  return (
    <>
      <Head>
        <title>{software?.brand_name} | RSD</title>
      </Head>

      <AppHeader />

      <section className="px-4 lg:container lg:mx-auto">
        <SoftwareIntroSection
          brand_name={software.brand_name}
          short_statement={software.short_statement}
        />
      </section>

      <GetStartedSection
        get_started_url={software.get_started_url}
        repository_url={software.repository_url}
      />

      <AppFooter />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  try{
    const {params} = context
    // console.log("getServerSideProps...params...", params)
    const software = await getSoftwareItem(params?.slug)
    if (typeof software == 'undefined' ||
    software?.length === 0){
    // returning this value
    // triggers 404 page on frontend
      return {
        notFound: true,
      }
    }
    return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
      props: {
        software: software[0],
        slug: params?.slug
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }}
