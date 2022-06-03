// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {ScriptProps} from 'next/script'

import {app} from '~/config/app'
import {getAccountFromToken} from '~/auth/jwtUtils'
import isMaintainerOfProject from '~/auth/permissions/isMaintainerOfProject'
import logger from '~/utils/logger'
import {
  getLinksForProject, getImpactForProject,
  getOutputForProject, getOrganisations,
  getProjectItem, getRelatedSoftwareForProject,
  getTeamForProject, getResearchDomainsForProject,
  getKeywordsForProject, getRelatedProjectsForProject
} from '~/utils/getProjects'
import {
  KeywordForProject, Project, ProjectLink,
  RelatedProject, ResearchDomain
} from '~/types/Project'
import {MentionForProject} from '~/types/Mention'
import {Contributor} from '~/types/Contributor'
import {ProjectOrganisationProps} from '~/types/Organisation'
import {RelatedSoftwareOfProject} from '~/types/SoftwareTypes'
import AppHeader from '~/components/layout/AppHeader'
import EditButton from '~/components/layout/EditButton'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import PageContainer from '~/components/layout/PageContainer'
import ContentHeader from '~/components/layout/ContentHeader'
import AppFooter from '~/components/layout/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import CanoncialUrl from '~/components/seo/CanonicalUrl'
import ProjectInfo from '~/components/projects/ProjectInfo'
import OrganisationsSection from '~/components/software/OrganisationsSection'
import ProjectMentions from '~/components/projects/ProjectMentions'
import ContributorsSection from '~/components/software/ContributorsSection'
import RelatedProjectsSection from '~/components/projects/RelatedProjectsSection'
import RelatedSoftwareSection from '~/components/software/RelatedSoftwareSection'

export interface ProjectPageProps extends ScriptProps{
  slug: string
  project: Project
  isMaintainer: boolean
  organisations: ProjectOrganisationProps[],
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  links: ProjectLink[],
  output: MentionForProject[],
  impact: MentionForProject[],
  team: Contributor[],
  relatedSoftware: RelatedSoftwareOfProject[],
  relatedProjects: RelatedProject[]
}

export default function ProjectPage(props: ProjectPageProps) {
  const [resolvedUrl, setResolvedUrl] = useState('')
  const {slug, project, isMaintainer, organisations,
    researchDomains, keywords, links, output, impact, team,
    relatedSoftware, relatedProjects
  } = props

  useEffect(() => {
    if (typeof location != 'undefined') {
      setResolvedUrl(location.href)
    }
  }, [])

  if (!project?.title){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }
  // console.log('ProjectItemPage...relatedSoftware...', relatedSoftware)
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${project?.title} | ${app.title}`}
        description={project?.description ?? ''}
      />
      {/* Page Head meta tags */}
      <OgMetaTags
        title={project?.title}
        description={project?.description ?? ''}
        url={resolvedUrl}
      />
      <CanoncialUrl
        canonicalUrl={resolvedUrl}
      />
      <AppHeader editButton={
        isMaintainer ?
        <EditButton
          title="Edit project"
          url={`${slug}/edit`}
        />
        : undefined
      } />
      <PageContainer>
        <ContentHeader
          title={project.title}
          subtitle={project.subtitle}
        />
        <ProjectInfo
          date_start={project?.date_start}
          date_end={project?.date_end}
          description={project?.description ?? null}
          image_id={project?.image_id}
          image_caption={project?.image_caption ?? null}
          grant_id={project.grant_id}
          fundingOrganisations={organisations.filter(item=>item.role==='funding')}
          researchDomains={researchDomains}
          keywords={keywords}
          links={links}
        />
        <div className="py-8"></div>
      </PageContainer>
      {/* Participating organisations */}
      <OrganisationsSection
        organisations={organisations.filter(item=>item.role!=='funding')}
      />
      {/* Project mentions */}
      <ProjectMentions
        impact={impact}
        output={output}
      />
      {/* Team (uses software components) */}
      <ContributorsSection
        title="Team"
        contributors={team}
      />
      {/* Related projects */}
      <RelatedProjectsSection
        relatedProjects={relatedProjects}
      />
      {/* Used software */}
      <RelatedSoftwareSection
        relatedSoftware={relatedSoftware}
      />
      {/* bottom spacer */}
      <section className="py-8"></section>
      <AppFooter />
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  try{
    const {params,req} = context
    // extract rsd_token
    const token = req?.cookies['rsd_token']
    const account = getAccountFromToken(token)
    const slug = params?.slug?.toString()
    // console.log("getServerSideProps...params...", params)
    const project = await getProjectItem({slug: params?.slug, token, frontend: false})
    if (typeof project == 'undefined'){
    // returning this value
    // triggers 404 page on frontend
      return {
        notFound: true,
      }
    }
    // fetch all info about project in parallel based on project.id
    const fetchData = [
      getOrganisations({project: project.id, token, frontend: false}),
      getResearchDomainsForProject({project: project.id, token, frontend: false}),
      getKeywordsForProject({project: project.id, token, frontend: false}),
      getOutputForProject({project: project.id, token, frontend: false}),
      getImpactForProject({project: project.id, token, frontend: false}),
      getTeamForProject({project: project.id, token, frontend: false}),
      getRelatedSoftwareForProject({project: project.id, token, frontend: false}),
      getRelatedProjectsForProject({project: project.id, token, frontend: false}),
      getLinksForProject({project: project.id, token, frontend: false}),
      isMaintainerOfProject({slug, account, token, frontend: false}),
    ]

    const [
      organisations,
      researchDomains,
      keywords,
      output,
      impact,
      team,
      relatedSoftware,
      relatedProjects,
      links,
      isMaintainer
    ] = await Promise.all(fetchData)

    // console.log("getServerSideProps...project...", project)
    return {
    // will be passed to the page component as props
    // see params in ProjectPages
      props: {
        project: project,
        slug: params?.slug,
        isMaintainer,
        organisations,
        researchDomains,
        keywords,
        output,
        impact,
        team,
        relatedSoftware,
        relatedProjects,
        links
      },
    }
  } catch (e:any) {
    logger(`ProjectPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
