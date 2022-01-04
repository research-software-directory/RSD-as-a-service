import {useState} from 'react'
import Head from 'next/head'

import AppHeader from '../../../components/layout/AppHeader'
import AppFooter from '../../../components/layout/AppFooter'
import PageContainer from '../../../components/layout/PageContainer'
import SoftwareIntroSection from '../../../components/software/SoftwareIntroSection'
import GetStartedSection from '../../../components/software/GetStartedSection'
import CitationSection from '../../../components/software/CitationSection'
import PageSnackbar from '../../../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../../../components/snackbar/PageSnackbarContext'
import AboutSection from '../../../components/software/AboutSection'

import {
  getSoftwareItem,
  getCitationsForSoftware,
  getTagsForSoftware,
  getLicenseForSoftware,
  Tag, License
} from '../../../utils/getSoftware'
import logger from '../../../utils/logger'
import {SoftwareItem} from '../../../types/SoftwareItem'
import {SoftwareCitationInfo} from '../../../types/SoftwareCitation'

export default function SoftwareIndexPage({software, citationInfo, tagsInfo, licenseInfo}:
  {slug:string,software:SoftwareItem,citationInfo:SoftwareCitationInfo, tagsInfo:Tag[], licenseInfo:License[]}) {
  const [options, setSnackbar] = useState(snackbarDefaults)

  console.log('licenseInfo...', licenseInfo)

  return (
    <>
      <Head>
        <title>{software?.brand_name} | RSD</title>
      </Head>
      <PageSnackbarContext.Provider value={{options,setSnackbar}}>
        <AppHeader />

        <PageContainer>
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
              concept_doi={software.concept_doi}
            />
            :null
        }
        <AboutSection
          brand_name={software.brand_name}
          bullets={software.bullets}
          read_more={software.read_more}
          tags={tagsInfo}
          licenses={licenseInfo}
        />
        <AppFooter />
      </PageSnackbarContext.Provider>
      <PageSnackbar options={options} setOptions={setSnackbar} />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  try{
    const {params} = context
    // console.log('getServerSideProps...params...', params)
    const software = await getSoftwareItem(params?.slug)
    // console.log('getServerSideProps...software...', software)
    if (typeof software == 'undefined'){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }

    // get citation/releases info
    const citationInfo = await getCitationsForSoftware(software.id)
    const tagsInfo = await getTagsForSoftware(software.id)
    const licenseInfo = await getLicenseForSoftware(software.id)

    return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
      props: {
        software,
        citationInfo,
        tagsInfo,
        licenseInfo
      }
    }
  }catch(e:any){
    logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
