import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {headers} from 'next/headers'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getCommunitiesOfMaintainer} from '~/auth/permissions/isMaintainerOfCommunity'
import {getMaintainerOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import isMaintainerOfProject from '~/auth/permissions/isMaintainerOfProject'
import {getImageUrl} from '~/utils/editImage'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {categoryFilter} from '~/components/category/apiCategories'
import ContentHeader from '~/components/layout/ContentHeader'
import DarkThemeSection from '~/components/layout/DarkThemeSection'
import EditPageButton from '~/components/layout/EditPageButton'
import PageContainer from '~/components/layout/PageContainer'
import MentionsSection from '~/components/mention/MentionsSection'
import {createMetadata} from '~/components/seo/apiMetadata'
import ContributorsSection from '~/components/software/ContributorsSection'
import OrganisationsSection from '~/components/software/OrganisationsSection'
import RelatedSoftwareSection from '~/components/software/RelatedSoftwareSection'
import TestimonialSection from '~/components/software/TestimonialsSection'
import {getTestimonialsForProject} from '~/components/projects/edit/testimonials/apiProjectTestimonial'
import ProjectInfo from '~/components/projects/ProjectInfo'
import RelatedProjectsSection from '~/components/projects/RelatedProjectsSection'
import {
  getCategoriesForProject,
  getImpactByProject,
  getKeywordsForProject,
  getLinksForProject,
  getMentionsForProject,
  getOrganisations,
  getProjectItem,
  getRelatedProjectsForProject,
  getRelatedSoftwareForProject,
  getResearchDomainsForProject,
  getTeamForProject
} from '~/components/projects/apiProjects'


/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:Readonly<{params: Promise<{slug: string}>}>
): Promise<Metadata> {
  // read route params

  const [{slug},{token},headersList] = await Promise.all([
    params,
    getUserSettings(),
    headers()
  ])

  // find project by slug
  const project = await getProjectItem({
    slug: slug,
    token: token
  })

  // console.group('ProjectViewPage.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('resp...', resp)
  // console.groupEnd()

  // if organisation exists we create metadata
  if (project?.title && project?.description){
    // extract domain to use in url
    const domain = headersList.get('host') || ''
    // build metadata
    const metadata = createMetadata({
      domain,
      page_title: project?.title,
      description: project.description,
      url: `https://${domain}/projects/${slug}`,
      // if image present return array with url else []
      image_url: project.image_id ? [
        `https://${domain}${getImageUrl(project.image_id)}`
      ] : []
    })
    return metadata
  }

  return {
    title: `Project | ${app.title}`,
    description: 'This project is in Research Software Directory',
  }
}


export default async function ProjectViewPage({
  params,
}:Readonly<{
  // extract slug from params
  params: Promise<{slug: string}>
}>) {
  // get slug and token
  const [{slug},{token},modules] = await Promise.all([
    params,
    getUserSettings(),
    getActiveModuleNames()
  ])

  // show 404 page if module is not enabled
  if (modules?.includes('projects')===false){
    notFound()
  }

  const [project, userInfo] = await Promise.all([
    getProjectItem({slug, token}),
    getUserFromToken(token)
  ])
  // show 404 page if project undefined
  if (project === undefined){
    notFound()
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
    projectMaintainer,
    orgMaintainer,
    comMaintainer
  ] = await Promise.all([
    getOrganisations({project: project.id, token}),
    getResearchDomainsForProject({project: project.id, token}),
    getKeywordsForProject({project: project.id, token}),
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
    getRelatedSoftwareForProject({project: project.id, token}),
    getRelatedProjectsForProject({project: project.id, token}),
    getLinksForProject({project: project.id, token}),
    isMaintainerOfProject({slug, account: userInfo?.account, token}),
    // get list of organisations user maintains
    getMaintainerOrganisations({token}),
    // get list of communities user maintains
    getCommunitiesOfMaintainer({token})
  ])

  // rsd_admin is added as maintainer
  const isMaintainer = userInfo?.role==='rsd_admin' ? true : projectMaintainer

  const filteredCategories = categories?.filter(path=>{
    return categoryFilter({root:path[0],isMaintainer,orgMaintainer,comMaintainer})
  })
  const fundingOrganisations = organisations.filter(item=>item.role==='funding') ?? []

  // console.group('ProjectViewPage')
  // console.log('categories...', categories)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('orgMaintainer...', orgMaintainer)
  // console.log('comMaintainer...', comMaintainer)
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <>
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
          fundingOrganisations={fundingOrganisations}
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
    </>
  )
}
