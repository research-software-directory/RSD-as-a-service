import Head from 'next/head'

// import DefaultLayout from '../../../components/layout/DefaultLayout'
import AppHeader from '../../../components/layout/AppHeader'
import AppFooter from '../../../components/layout/AppFooter'
import PageContainer from '../../../components/layout/PageContainer'

import SoftwareIntroSection from '../../../components/software/SoftwareIntroSection'
import GetStartedSection from '../../../components/software/GetStartedSection'
import CitationSection from '../../../components/software/CitationSection'

import {getSoftwareItem, getCitationsForSoftware} from '../../../utils/getSoftware'
import {SoftwareItem} from '../../../types/SoftwareItem'
import {SoftwareCitationInfo} from '../../../types/SoftwareCitation'

export default function SoftwareIndexPage({slug, software, citationInfo}:
  {slug:string,software:SoftwareItem,citationInfo:SoftwareCitationInfo}) {

  return (
    <>
      <Head>
        <title>{software?.brand_name} | RSD</title>
      </Head>

      <AppHeader />

      <PageContainer className="px-4">
        <SoftwareIntroSection
          brand_name={software.brand_name}
          short_statement={software.short_statement}
        />
      </PageContainer>

      <GetStartedSection
        get_started_url={software.get_started_url}
        repository_url={software.repository_url}
      />
      {
        citationInfo ?
          <CitationSection
            citationInfo={citationInfo}
          />
          :null
      }
      <AppFooter />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  try{
    const {params} = context
    console.log('getServerSideProps...params...', params)
    const software = await getSoftwareItem(params?.slug)
    console.log('getServerSideProps...software...', software)
    if (typeof software == 'undefined'){
      // returning this value
      // triggers 404 page on frontend
      return {
        notFound: true,
      }
    }

    // get citation/releases info
    const citationInfo = await getCitationsForSoftware(software.id)

    return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
      props: {
        slug: params?.slug,
        software,
        citationInfo
      }
    }
  }catch(e){
    console.log('failed', e)
    return {
      notFound: true,
    }
  }}
