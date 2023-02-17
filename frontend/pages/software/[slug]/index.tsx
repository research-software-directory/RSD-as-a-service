// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next'
import {ScriptProps} from 'next/script'

import {app} from '~/config/app'
import {isMaintainerOfSoftware} from '~/auth/permissions/isMaintainerOfSoftware'
import {getAccountFromToken} from '~/auth/jwtUtils'
import PageMeta from '~/components/seo/PageMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import CitationMeta from '~/components/seo/CitationMeta'
import CanoncialUrl from '~/components/seo/CanonicalUrl'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import SoftwareIntroSection from '~/components/software/SoftwareIntroSection'
import GetStartedSection from '~/components/software/GetStartedSection'
import CitationSection from '~/components/software/CitationSection'
import AboutSection from '~/components/software/AboutSection'
import MentionsSection from '~/components/software/MentionsSection'
import ContributorsSection from '~/components/software/ContributorsSection'
import TestimonialSection from '~/components/software/TestimonialsSection'
import EditPageButton from '~/components/layout/EditPageButton'
import OrganisationsSection from '~/components/software/OrganisationsSection'
import RelatedProjectsSection from '~/components/projects/RelatedProjectsSection'
import RelatedSoftwareSection from '~/components/software/RelatedSoftwareSection'
import {
  getSoftwareItem,
  getRepostoryInfoForSoftware,
  getLicenseForSoftware,
  getContributorMentionCount,
  getRemoteMarkdown,
  ContributorMentionCount,
  getKeywordsForSoftware,
  getRelatedProjectsForSoftware,
  getReleasesForSoftware,
  SoftwareVersion,
} from '~/utils/getSoftware'
import logger from '~/utils/logger'
import {getDisplayName} from '~/utils/getDisplayName'
import {getContributorsForSoftware} from '~/utils/editContributors'
import {getTestimonialsForSoftware} from '~/utils/editTestimonial'
import {getRelatedSoftwareForSoftware} from '~/utils/editRelatedSoftware'
import {getMentionsForSoftware} from '~/utils/editMentions'
import {getParticipatingOrganisations} from '~/utils/editOrganisation'
import {
  KeywordForSoftware, License, RepositoryInfo,
  SoftwareItem, SoftwareListItem
} from '~/types/SoftwareTypes'
import {Contributor} from '~/types/Contributor'
import {Testimonial} from '~/types/Testimonial'
import {MentionItemProps} from '~/types/Mention'
import {ParticipatingOrganisationProps} from '~/types/Organisation'
import {RelatedProject} from '~/types/Project'
import NoContent from '~/components/layout/NoContent'

interface SoftwareIndexData extends ScriptProps{
  slug: string
  software: SoftwareItem
  releases: SoftwareVersion[]
  keywords: KeywordForSoftware[]
  licenseInfo: License[]
  repositoryInfo: RepositoryInfo
  softwareIntroCounts: ContributorMentionCount
  mentions: MentionItemProps[]
  testimonials: Testimonial[]
  contributors: Contributor[]
  relatedSoftware: SoftwareListItem[]
  relatedProjects: RelatedProject[]
  isMaintainer: boolean,
  organisations: ParticipatingOrganisationProps[],
}

export default function SoftwareIndexPage(props:SoftwareIndexData) {
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [author, setAuthor] = useState('')
  // extract data from props
  const {
    software, releases, keywords,
    licenseInfo, repositoryInfo, softwareIntroCounts,
    mentions, testimonials, contributors,
    relatedSoftware, relatedProjects, isMaintainer,
    slug, organisations
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
    return <NoContent />
  }
  // console.log('SoftwareIndexPage...releases...', releases)
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${software?.brand_name} | ${app.title}`}
        description={software.short_statement ?? ''}
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
        description={software.short_statement ?? ''}
      />
      <CanoncialUrl />
      <AppHeader />
      {/* Edit page button only when maintainer */}
      <EditPageButton
        title="Edit software"
        url={`${slug}/edit`}
        isMaintainer={isMaintainer}
        variant="text"
      />
      <SoftwareIntroSection
        brand_name={software.brand_name}
        short_statement={software.short_statement ?? ''}
        counts={softwareIntroCounts}
      />
      <GetStartedSection
        get_started_url={software.get_started_url}
        repository_url={repositoryInfo?.url}
        commit_history={repositoryInfo?.commit_history}
        commit_history_scraped_at={repositoryInfo?.commit_history_scraped_at}
      />
      <CitationSection
        releases={releases}
        concept_doi={software.concept_doi}
      />
      <AboutSection
        brand_name={software.brand_name}
        description={software?.description ?? ''}
        description_type={software?.description_type}
        keywords={keywords}
        licenses={licenseInfo}
        languages={repositoryInfo?.languages}
        repository={repositoryInfo?.url}
        platform={repositoryInfo?.code_platform}
        image_id={software.image_id}
      />
      {/* Participating organisations */}
      <OrganisationsSection
        organisations={organisations}
      />
      {/* Mentions */}
      <MentionsSection
        mentions={mentions}
      />
      {/* Testimonials */}
      <TestimonialSection
        testimonials={testimonials}
      />
      {/* Contributors */}
      <ContributorsSection
        contributors={contributors}
      />
      {/* Related projects (uses project components) */}
      <RelatedProjectsSection
        relatedProjects={relatedProjects}
      />
      {/* Related software */}
      <RelatedSoftwareSection
        relatedSoftware={relatedSoftware}
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
    const userInfo = getAccountFromToken(token)
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
      // software versions info
      getReleasesForSoftware(software.id,token),
      // keywords
      getKeywordsForSoftware(software.id,false,token),
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
      getRelatedSoftwareForSoftware({software: software.id, frontend: false, token}),
      // relatedProjects
      getRelatedProjectsForSoftware({software: software.id, token, frontend: false}),
      // check if maintainer
      isMaintainerOfSoftware({slug, account:userInfo?.account, token, frontend: false}),
      // get organisations
      getParticipatingOrganisations({software:software.id,frontend:false,token})
    ]
    const [
      releases,
      keywords,
      licenseInfo,
      repositoryInfo,
      softwareIntroCounts,
      mentions,
      testimonials,
      contributors,
      relatedSoftware,
      relatedProjects,
      isMaintainer,
      organisations
    ] = await Promise.all(fetchData)

    // pass data to page component as props
    return {
      props: {
        software,
        releases,
        keywords,
        licenseInfo,
        repositoryInfo,
        softwareIntroCounts,
        mentions,
        testimonials,
        contributors,
        relatedSoftware,
        relatedProjects,
        isMaintainer: isMaintainer ? isMaintainer : userInfo?.role==='rsd_admin',
        organisations,
        slug
      }
    }
  }catch(e:any){
    logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
