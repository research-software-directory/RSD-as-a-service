import {useState} from 'react'
import Head from 'next/head'

import {app} from '../../../config/app'
import AppHeader from '../../../components/layout/AppHeader'
import AppFooter from '../../../components/layout/AppFooter'
import PageContainer from '../../../components/layout/PageContainer'
import ContentInTheMiddle from '../../../components/layout/ContentInTheMiddle'
import SoftwareIntroSection from '../../../components/software/SoftwareIntroSection'
import GetStartedSection from '../../../components/software/GetStartedSection'
import CitationSection from '../../../components/software/CitationSection'
import PageSnackbar from '../../../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../../../components/snackbar/PageSnackbarContext'
import AboutSection from '../../../components/software/AboutSection'
import MentionsSection from '../../../components/software/MentionsSection'
import ContributorsSection from '../../../components/software/ContributorsSection'
import TestimonialSection from '../../../components/software/TestimonialsSection'
import RelatedToolsSection from '../../../components/software/RelatedToolsSection'

import {
  getSoftwareItem,
  getCitationsForSoftware,
  getTagsForSoftware,
  getLicenseForSoftware,
  getContributorMentionCount,
  getMentionsForSoftware,
  getTestimonialsForSoftware,
  getContributorsForSoftware,
  getRelatedToolsForSoftware,
  Tag, License, ContributorMentionCount,
  Mention,RelatedTools
} from '../../../utils/getSoftware'
import logger from '../../../utils/logger'
import {SoftwareItem} from '../../../types/SoftwareItem'
import {SoftwareCitationInfo} from '../../../types/SoftwareCitation'
import {ScriptProps} from 'next/script'
import {Contributor} from '../../../types/Contributor'
import {Testimonial} from '../../../types/Testimonial'

interface SoftwareIndexData extends ScriptProps{
  slug: string,
  software: SoftwareItem,
  citationInfo: SoftwareCitationInfo,
  tagsInfo: Tag[],
  licenseInfo: License[],
  softwareIntroCounts: ContributorMentionCount,
  mentions: Mention[],
  testimonials: Testimonial[],
  contributors: Contributor[],
  relatedTools: RelatedTools[]
}


export default function SoftwareIndexPage(props:SoftwareIndexData) {
  const [options, setSnackbar] = useState(snackbarDefaults)
  // extract data from props
  const {
    software, citationInfo, tagsInfo,
    licenseInfo, softwareIntroCounts,
    mentions, testimonials, contributors,
    relatedTools
  } = props

  if (!software?.brand_name){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }

  return (
    <>
      <Head>
        <title>{software?.brand_name} | {app.title}</title>
      </Head>
      <PageSnackbarContext.Provider value={{options,setSnackbar}}>
        <AppHeader />
        <PageContainer>
          <SoftwareIntroSection
            brand_name={software.brand_name}
            short_statement={software.short_statement}
            counts={softwareIntroCounts}
          />
        </PageContainer>
        <GetStartedSection
          get_started_url={software.get_started_url}
          repository_url={software.repository_url}
        />
        <CitationSection
          citationInfo={citationInfo}
          concept_doi={software.concept_doi}
        />
        <AboutSection
          brand_name={software.brand_name}
          bullets={software?.bullets ?? ''}
          read_more={software?.read_more ?? ''}
          tags={tagsInfo}
          licenses={licenseInfo}
          repositories={software.repository_url}
        />
        <MentionsSection
          mentions={mentions}
        />
        <TestimonialSection
          testimonials={testimonials}
        />
        <ContributorsSection
          contributors={contributors}
        />
        <RelatedToolsSection
          relatedTools={relatedTools}
        />
        {/* bottom spacer */}
        <section className="py-12"></section>
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
    // fetch all info about software based on software.id in parallel
    const fetchData = [
      // citationInfo
      getCitationsForSoftware(software.id),
      // tagsInfo
      getTagsForSoftware(software.id),
      // licenseInfo
      getLicenseForSoftware(software.id),
      // softwareIntroCounts
      getContributorMentionCount(software.id),
      // mentions
      getMentionsForSoftware(software.id),
      // testimonials
      getTestimonialsForSoftware(software.id),
      // contributors
      getContributorsForSoftware(software.id),
      // relatedTools
      getRelatedToolsForSoftware(software.id)
    ]
    const [
      citationInfo,
      tagsInfo,
      licenseInfo,
      softwareIntroCounts,
      mentions,
      testimonials,
      contributors,
      relatedTools
    ] = await Promise.all(fetchData)

    // const citationInfo = await getCitationsForSoftware(software.id)
    // const tagsInfo = await getTagsForSoftware(software.id)
    // const licenseInfo = await getLicenseForSoftware(software.id)
    // const softwareIntroCounts = await getContributorMentionCount(software.id)
    // const mentions = await getMentionsForSoftware(software.id)
    // const contributors = await getContributorsForSoftware(software.id)

    return {
    // pass data to page component as props
      props: {
        software,
        citationInfo,
        tagsInfo,
        licenseInfo,
        softwareIntroCounts,
        mentions,
        testimonials,
        contributors,
        relatedTools
      }
    }
  }catch(e:any){
    logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
