import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next'

import {app} from '../../../config/app'
import PageMeta from '../../../components/seo/PageMeta'
import OgMetaTags from '../../../components/seo/OgMetaTags'
import CitationMeta from '../../../components/seo/CitationMeta'
import CanoncialUrl from '../../../components/seo/CanonicalUrl'
import AppHeader from '../../../components/layout/AppHeader'
import AppFooter from '../../../components/layout/AppFooter'
import PageContainer from '../../../components/layout/PageContainer'
import ContentInTheMiddle from '../../../components/layout/ContentInTheMiddle'
import SoftwareIntroSection from '../../../components/software/SoftwareIntroSection'
import GetStartedSection from '../../../components/software/GetStartedSection'
import CitationSection from '../../../components/software/CitationSection'
import AboutSection from '../../../components/software/AboutSection'
import MentionsSection from '../../../components/software/MentionsSection'
import ContributorsSection from '../../../components/software/ContributorsSection'
import TestimonialSection from '../../../components/software/TestimonialsSection'
import RelatedToolsSection from '../../../components/software/RelatedToolsSection'
import {
  getSoftwareItem,
  getRepostoryInfoForSoftware,
  getCitationsForSoftware,
  getTagsForSoftware,
  getLicenseForSoftware,
  getContributorMentionCount,
  getRemoteMarkdown,
  ContributorMentionCount,
} from '../../../utils/getSoftware'
import {isMaintainerOfSoftware} from '../../../utils/editSoftware'
import logger from '../../../utils/logger'
import {License, RelatedTools, RepositoryInfo, SoftwareItem, Tag} from '../../../types/SoftwareTypes'
import {SoftwareCitationInfo} from '../../../types/SoftwareCitation'
import {ScriptProps} from 'next/script'
import {Contributor} from '../../../types/Contributor'
import {Testimonial} from '../../../types/Testimonial'
import {getDisplayName} from '../../../utils/getDisplayName'
import {getAccountFromToken} from '../../../auth/jwtUtils'
import EditSoftwareButton from '../../../components/software/edit/EditSoftwareButton'
import {getContributorsForSoftware} from '../../../utils/editContributors'
import {getTestimonialsForSoftware} from '../../../utils/editTestimonial'
import {getRelatedToolsForSoftware} from '../../../utils/editRelatedSoftware'
import {MentionForSoftware} from '../../../types/MentionType'
import {getMentionsForSoftware} from '../../../utils/editMentions'

interface SoftwareIndexData extends ScriptProps{
  slug: string
  software: SoftwareItem
  citationInfo: SoftwareCitationInfo
  tagsInfo: Tag[]
  licenseInfo: License[]
  repositoryInfo: RepositoryInfo
  softwareIntroCounts: ContributorMentionCount
  mentions: MentionForSoftware[]
  testimonials: Testimonial[]
  contributors: Contributor[]
  relatedTools: RelatedTools[]
  isMaintainer: boolean
}

export default function SoftwareIndexPage(props:SoftwareIndexData) {
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [author, setAuthor] = useState('')
  // extract data from props
  const {
    software, citationInfo, tagsInfo,
    licenseInfo, repositoryInfo, softwareIntroCounts,
    mentions, testimonials, contributors,
    relatedTools, isMaintainer, slug
  } = props

  useEffect(() => {
    if (typeof location != 'undefined') {
      setResolvedUrl(location.href)
    }
  }, [])
  useEffect(() => {
    const contact = contributors.filter(item => item.is_contact_person)
    if (contact.length > 0) {
      const name = getDisplayName(contact[0])
      setAuthor(name||'')
    }
  },[contributors])

  if (!software?.brand_name){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${software?.brand_name} | ${app.title}`}
        description={software.short_statement}
      />
      {/* Page Head meta tags */}
      <CitationMeta
        title={software?.brand_name}
        author={author}
        publication_date={software.created_at}
        concept_doi={software.concept_doi}
      />
      {/* Page Head meta tags */}
      <OgMetaTags
        title={software?.brand_name}
        description={software.short_statement}
        url={resolvedUrl}
      />
      <CanoncialUrl
        canonicalUrl={resolvedUrl}
      />
      <AppHeader editButton={
        isMaintainer ?
        <EditSoftwareButton slug={slug} />
        : undefined
      }/>
      <PageContainer>
        <SoftwareIntroSection
          brand_name={software.brand_name}
          short_statement={software.short_statement}
          counts={softwareIntroCounts}
        />
      </PageContainer>
      <GetStartedSection
        get_started_url={software.get_started_url}
        commit_history={repositoryInfo?.commit_history}
      />
      <CitationSection
        citationInfo={citationInfo}
        concept_doi={software.concept_doi}
      />
      <AboutSection
        brand_name={software.brand_name}
        description={software?.description ?? ''}
        tags={tagsInfo}
        licenses={licenseInfo}
        repository={repositoryInfo?.url}
        languages={repositoryInfo?.languages}
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
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try {
    const {params, req: {cookies}} = context
    // extract rsd_token
    const token = cookies['rsd_token']
    const slug = params?.slug?.toString()
    const account = getAccountFromToken(token)
    const software = await getSoftwareItem(slug,token)
    // console.log('getServerSideProps...software...', software)
    if (typeof software == 'undefined'){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // download remote markdown
    if (software.description_type === 'link' && software.description_url) {
      const markdown = await getRemoteMarkdown(software.description_url)
      if (typeof markdown === 'string') {
        // NOTE! we always use description on software page view to show markdown
        software.description = markdown
      }
    }
    // fetch all info about software in parallel based on software.id
    const fetchData = [
      // citationInfo
      getCitationsForSoftware(software.id,token),
      // tagsInfo
      getTagsForSoftware(software.id,false,token),
      // licenseInfo
      getLicenseForSoftware(software.id, false, token),
      // repositoryInfo: url, languages and commits
      getRepostoryInfoForSoftware(software.id, token),
      // softwareMentionCounts
      getContributorMentionCount(software.id,token),
      // mentions
      getMentionsForSoftware({software: software.id, frontend: false, token}),
      // testimonials
      getTestimonialsForSoftware({software:software.id,frontend: false,token}),
      // contributors
      getContributorsForSoftware({software:software.id,frontend:false,token}),
      // relatedTools
      getRelatedToolsForSoftware({software:software.id,frontend:false,token}),
      // check if maintainer
      isMaintainerOfSoftware({slug,account,token,frontend:false})
    ]
    const [
      citationInfo,
      tagsInfo,
      licenseInfo,
      repositoryInfo,
      softwareIntroCounts,
      mentions,
      testimonials,
      contributors,
      relatedTools,
      isMaintainer
    ] = await Promise.all(fetchData)

    // pass data to page component as props
    return {
      props: {
        software,
        citationInfo,
        tagsInfo,
        licenseInfo,
        repositoryInfo,
        softwareIntroCounts,
        mentions,
        testimonials,
        contributors,
        relatedTools,
        isMaintainer,
        slug
      }
    }
  }catch(e:any){
    logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
