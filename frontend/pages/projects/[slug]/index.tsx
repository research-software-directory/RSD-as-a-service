import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {ScriptProps} from 'next/script'

import {useAuth} from '../../../auth'
import {app} from '../../../config/app'
import logger from '../../../utils/logger'
import AppHeader from '../../../components/layout/AppHeader'
import EditButton from '../../../components/layout/EditButton'
import ContentInTheMiddle from '../../../components/layout/ContentInTheMiddle'
import PageContainer from '../../../components/layout/PageContainer'
import ContentHeader from '../../../components/layout/ContentHeader'
import AppFooter from '../../../components/layout/AppFooter'
import PageMeta from '../../../components/seo/PageMeta'
import OgMetaTags from '../../../components/seo/OgMetaTags'
import CanoncialUrl from '../../../components/seo/CanonicalUrl'
import {extractLinksFromProject, getOrganisationsOfProject, getParticipatingOrganisations, getProjectItem, getTagsForProject, getTopicsForProject} from '../../../utils/getProjects'
import {Project, ProjectLink} from '../../../types/Project'
import ProjectInfo from '../../../components/projects/ProjectInfo'
import OrganisationsSection from '../../../components/software/OrganisationsSection'
import {ParticipatingOrganisationProps} from '../../../types/Organisation'

interface ProjectIndexProps extends ScriptProps{
  slug: string
  project: Project
  isMaintainer: boolean
  organisations: ParticipatingOrganisationProps[],
  technologies: string[],
  topics: string[],
  links: ProjectLink[]
}

export default function ProjectItemPage(props: ProjectIndexProps) {
  const [resolvedUrl, setResolvedUrl] = useState('')
  const router = useRouter()
  const {session: {status}} = useAuth()
  const {slug, project, isMaintainer, organisations, technologies, topics, links} = props

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
  // console.log('ProjectItemPage...technologies...', technologies)
  // console.log('ProjectItemPage...topics...', topics)
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
          links={links}
          technologies={technologies}
          topics={topics}
        />
      </PageContainer>
      {/* Participating organisations */}
      <OrganisationsSection
        organisations={organisations}
      />
      {/* bottom spacer */}
      <section className="py-12"></section>
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
    // console.log("getServerSideProps...params...", params)
    const project = await getProjectItem(params?.slug)
    if (typeof project == 'undefined'){
    // returning this value
    // triggers 404 page on frontend
      return {
        notFound: true,
      }
    }
    // fetch all info about software in parallel based on software.id
    const fetchData = [
      getParticipatingOrganisations({project: project.id, token, frontend: false}),
      getTagsForProject({project: project.id, token, frontend: false}),
      getTopicsForProject({project: project.id, token, frontend: false}),
    ]

    const [
      organisations,
      technologies,
      topics
    ] = await Promise.all(fetchData)

    // console.log("getServerSideProps...project...", project)
    return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
      props: {
        project: project,
        slug: params?.slug,
        isMaintainer: false,
        organisations,
        technologies,
        topics,
        links: extractLinksFromProject(project)
      },
    }
  } catch (e:any) {
    logger(`ProjectIndexPage.getServerSideProps: ${e.message}`,'error')
    return {
      notFound: true,
    }
  }}
