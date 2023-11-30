// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ScriptProps} from 'next/script'

import {app} from '~/config/app'
import {getAccountFromToken} from '~/auth/jwtUtils'
import isMaintainerOfProject from '~/auth/permissions/isMaintainerOfProject'
import logger from '~/utils/logger'
import {
  getLinksForProject, getOrganisations,
  getProjectItem, getRelatedSoftwareForProject,
  getTeamForProject, getResearchDomainsForProject,
  getKeywordsForProject, getRelatedProjectsForProject,
  getMentionsForProject
} from '~/utils/getProjects'
import {
  KeywordForProject, Project, ProjectLink,
  RelatedProject, ResearchDomain
} from '~/types/Project'
import {MentionItemProps} from '~/types/Mention'
import {Person} from '~/types/Contributor'
import {ProjectOrganisationProps} from '~/types/Organisation'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import EditPageButton from '~/components/layout/EditPageButton'
import PageContainer from '~/components/layout/PageContainer'
import ContentHeader from '~/components/layout/ContentHeader'
import NoContent from '~/components/layout/NoContent'
import DarkThemeSection from '~/components/layout/DarkThemeSection'
import PageMeta from '~/components/seo/PageMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import OrganisationsSection from '~/components/software/OrganisationsSection'
import ContributorsSection from '~/components/software/ContributorsSection'
import RelatedSoftwareSection from '~/components/software/RelatedSoftwareSection'
import ProjectInfo from '~/components/projects/ProjectInfo'
import RelatedProjectsSection from '~/components/projects/RelatedProjectsSection'
import MentionsSection from '~/components/mention/MentionsSection'

export interface ProjectPageProps extends ScriptProps{
  slug: string
  project: Project
  isMaintainer: boolean
  organisations: ProjectOrganisationProps[],
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  links: ProjectLink[],
  output: MentionItemProps[],
  impact: MentionItemProps[],
  team: Person[],
  relatedSoftware: SoftwareOverviewItemProps[],
  relatedProjects: RelatedProject[]
}

export default function ProjectPage(props: ProjectPageProps) {
  const {slug, project, isMaintainer, organisations,
    researchDomains, keywords, links, output, impact, team,
    relatedSoftware, relatedProjects
  } = props

  if (!project?.title){
    return <NoContent />
  }
  // console.log('ProjectPage...output...', output)
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
      />
      <CanonicalUrl/>
      <AppHeader />
      <EditPageButton
        title="Edit project"
        url={`${slug}/edit/information`}
        isMaintainer={isMaintainer}
        variant="text"
      />
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
          image_contain={project?.image_contain ?? false}
          grant_id={project.grant_id}
          fundingOrganisations={organisations.filter(item=>item.role==='funding')}
          researchDomains={researchDomains}
          keywords={keywords}
          links={links}
        />
        {/* <div className="py-8"></div> */}
      </PageContainer>
      {/* Participating organisations */}
      <OrganisationsSection
        organisations={organisations.filter(item=>item.role!=='funding')}
      />
      <DarkThemeSection>
        {/* Project impact mentions */}
        <MentionsSection
          title="Impact"
          mentions={impact}
        />
        {/* Project output */}
        <MentionsSection
          title="Output"
          mentions={output}
        />
      </DarkThemeSection>
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
    const userInfo = getAccountFromToken(token)
    const slug = params?.slug?.toString()
    // console.log('getServerSideProps...userInfo...', userInfo)
    const project = await getProjectItem({slug: params?.slug, token})
    if (typeof project == 'undefined'){
      // returning this value triggers 404 page on frontend
      return {
        notFound: true,
      }
    }
    // fetch all info about project in parallel based on project.id
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
    ] = await Promise.all([
      getOrganisations({project: project.id, token, frontend: false}),
      getResearchDomainsForProject({project: project.id, token, frontend: false}),
      getKeywordsForProject({project: project.id, token, frontend: false}),
      // Output
      getMentionsForProject({project: project.id, token, table:'output_for_project'}),
      // Impact
      getMentionsForProject({project: project.id, token, table:'impact_for_project'}),
      getTeamForProject({project: project.id, token, frontend: false}),
      getRelatedSoftwareForProject({project: project.id, token, frontend: false}),
      getRelatedProjectsForProject({project: project.id, token, frontend: false}),
      getLinksForProject({project: project.id, token, frontend: false}),
      isMaintainerOfProject({slug, account:userInfo?.account, token, frontend: false}),
    ])

    // console.log("getServerSideProps...project...", project)
    return {
    // will be passed to the page component as props
    // see params in ProjectPages
      props: {
        project: project,
        slug: params?.slug,
        isMaintainer: isMaintainer ? isMaintainer : userInfo?.role==='rsd_admin',
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
