// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ScriptProps} from 'next/script'

import {app} from '~/config/app'
import logger from '~/utils/logger'
import {getAccountFromToken} from '~/auth/jwtUtils'
import isMaintainerOfProject from '~/auth/permissions/isMaintainerOfProject'
import {getMaintainerOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getCommunitiesOfMaintainer} from '~/auth/permissions/isMaintainerOfCommunity'
import {
  getLinksForProject, getOrganisations,
  getProjectItem, getRelatedSoftwareForProject,
  getTeamForProject, getResearchDomainsForProject,
  getKeywordsForProject, getRelatedProjectsForProject,
  getMentionsForProject, getImpactByProject,
  getCategoriesForProject
} from '~/utils/getProjects'
import {
  KeywordForProject, Project, ProjectLink,
  RelatedProject, ResearchDomain
} from '~/types/Project'
import {MentionItemProps} from '~/types/Mention'
import {Person} from '~/types/Contributor'
import {ProjectOrganisationProps} from '~/types/Organisation'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {Testimonial} from '~/types/Testimonial'
import {CategoryPath} from '~/types/Category'
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
import {getTestimonialsForProject} from '~/components/projects/edit/testimonials/apiProjectTestimonial'
import TestimonialSection from '~/components/software/TestimonialsSection'
import {useProjectCategoriesFilter} from '~/components/category/useCategoriesFilter'

export interface ProjectPageProps extends ScriptProps{
  slug: string
  project: Project
  isMaintainer: boolean
  organisations: ProjectOrganisationProps[],
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  categories: CategoryPath[],
  links: ProjectLink[],
  output: MentionItemProps[],
  impact: MentionItemProps[],
  testimonials: Testimonial[]
  team: Person[],
  relatedSoftware: SoftwareOverviewItemProps[],
  relatedProjects: RelatedProject[],
  orgMaintainer: string[],
  comMaintainer: string[]
}

export default function ProjectPage(props: ProjectPageProps) {
  const {slug, project, isMaintainer, organisations,
    researchDomains, keywords, categories, links, output, impact, team,
    relatedSoftware, relatedProjects, testimonials,orgMaintainer,comMaintainer
  } = props
  // filter categories by status (maintainer can see all entries)
  const filteredCategories = useProjectCategoriesFilter({
    categories,isMaintainer,orgMaintainer,comMaintainer
  })

  if (!project?.title){
    return <NoContent />
  }

  // console.group('ProjectPage')
  // console.log('categories...', categories)
  // console.log('filteredCategories...', filteredCategories)
  // console.log('orgMaintainer...', orgMaintainer)
  // console.log('comMaintainer...', comMaintainer)
  // console.groupEnd()

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
        variant="contained"
      />
      <PageContainer className='flex-1'>
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
          categories={filteredCategories}
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
      {/* Testimonials (uses software components) */}
      <TestimonialSection
        testimonials={testimonials}
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
      categories,
      output,
      impact,
      testimonials,
      team,
      relatedSoftware,
      relatedProjects,
      links,
      isMaintainer,
      orgMaintainer,
      comMaintainer
    ] = await Promise.all([
      getOrganisations({project: project.id, token, frontend: false}),
      getResearchDomainsForProject({project: project.id, token, frontend: false}),
      getKeywordsForProject({project: project.id, token, frontend: false}),
      // Project specific categories
      getCategoriesForProject({project_id:project.id,token}),
      // Output
      getMentionsForProject({project: project.id, token, table:'output_for_project'}),
      // Impact
      getImpactByProject({project: project.id, token}),
      // testimonials
      getTestimonialsForProject({project:project.id,token}),
      // Team
      getTeamForProject({project: project.id, token}),
      getRelatedSoftwareForProject({project: project.id, token, frontend: false}),
      getRelatedProjectsForProject({project: project.id, token, frontend: false}),
      getLinksForProject({project: project.id, token, frontend: false}),
      isMaintainerOfProject({slug, account:userInfo?.account, token, frontend: false}),
      // get list of organisations user maintains
      getMaintainerOrganisations({token}),
      // get list of communities user maintains
      getCommunitiesOfMaintainer({token})
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
        categories,
        output,
        impact,
        testimonials,
        team,
        relatedSoftware,
        relatedProjects,
        links,
        orgMaintainer,
        comMaintainer
      },
    }
  } catch (e:any) {
    logger(`ProjectPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }
}
