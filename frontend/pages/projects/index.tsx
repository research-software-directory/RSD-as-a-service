// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next'

import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import {app} from '~/config/app'
import {ProjectListItem} from '~/types/Project'
import {getProjectList} from '~/utils/getProjects'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {projectListUrl} from '~/utils/postgrestUrl'
import {getBaseUrl} from '~/utils/fetchHelpers'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import MainContent from '~/components/layout/MainContent'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {getUserSettings, setDocumentCookie} from '~/components/software/overview/userSettings'
import useProjectOverviewParams from '~/components/projects/overview/useProjectOverviewParams'
import OverviewPageBackground from '~/components/software/overview/PageBackground'
import FiltersPanel from '~/components/layout/filter/FiltersPanel'
import {KeywordFilterOption} from '~/components/software/overview/filters/softwareFiltersApi'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import {
  projectDomainsFilter,
  projectKeywordsFilter,
  projectParticipatingOrganisationsFilter
} from '~/components/projects/overview/filters/projectFiltersApi'
import {projectOrderOptions} from '~/components/projects/overview/filters/OrderProjectsBy'
import {ResearchDomainOption} from '~/components/projects/overview/filters/ResearchDomainFilter'
import {OrganisationOption} from '~/components/projects/overview/filters/OrganisationFilter'
import ProjectFilters from '~/components/projects/overview/filters/ProjectFilters'
import ProjectSearchSection from '~/components/projects/overview/search/ProjectSearchSection'
import ProjectOverviewContent from '~/components/projects/overview/ProjectOverviewContent'
import ProjectFiltersModal from '~/components/projects/overview/filters/ProjectFiltersModal'

export type ProjectOverviewPageProps = {
  search?: string | null
  order?: string | null,
  keywords?: string[] | null,
  keywordsList: KeywordFilterOption[],
  domains?: string[] | null
  domainsList: ResearchDomainOption[]
  organisations: string[] | null
  organisationsList: OrganisationOption[]
  page: number,
  rows: number,
  count: number,
  layout: LayoutType,
  projects: ProjectListItem[]
}

const pageTitle = `Projects | ${app.title}`
const pageDesc = 'The list of research projects registerd in the Research Software Directory.'

export default function ProjectsOverviewPage({
  search, order,
  keywords, keywordsList,
  domains, domainsList,
  organisations, organisationsList,
  page, rows, count, layout,
  projects
}: ProjectOverviewPageProps) {
  const {handleQueryChange} = useProjectOverviewParams()
  const smallScreen = useMediaQuery('(max-width:640px)')
  const [view, setView] = useState<ProjectLayoutType>('grid')
  const [modal,setModal] = useState(false)
  const numPages = Math.ceil(count / rows)
  const filterCnt = getFilterCount()

  // console.group('ProjectsOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('domains...', domains)
  // console.log('organisations...', organisations)
  // console.log('order...', order)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', count)
  // console.log('layout...', layout)
  // console.log('keywordsList...', keywordsList)
  // console.log('domainsList...', domainsList)
  // console.log('organisationsList...', organisationsList)
  // console.log('projects...', projects)
  // console.groupEnd()

  // Update view state based on layout value
  useEffect(() => {
    if (layout) {
      if (layout === 'masonry') {
        setView('grid')
      } else {
        setView(layout)
      }
    }
  },[layout])

  function setLayout(view: ProjectLayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
  }

  function getFilterCount() {
    let count = 0
    if (keywords) count++
    if (domains) count++
    if (organisations) count++
    if (search) count++
    return count
  }

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      <CanonicalUrl />
      <OverviewPageBackground>
        {/* App header */}
        <AppHeader />
        <MainContent className='pb-12'>
          {/* Page title */}
          <h1
            className="mt-8"
            id="list-top"
            role="heading"
          >
            All projects
          </h1>
          {/* Page grid with 2 sections: left filter panel and main content */}
          <div className="flex-1 flex w-full my-4 gap-8">
            {/* Filters panel large screen */}
            {smallScreen===false &&
              <FiltersPanel>
                <ProjectFilters
                  filterCnt={filterCnt}
                  orderBy={order ?? ''}
                  keywords={keywords ?? []}
                  keywordsList={keywordsList}
                  domains={domains ?? []}
                  domainsList={domainsList}
                  organisations={organisations ?? []}
                  organisationsList={organisationsList}
                />
              </FiltersPanel>
            }
            {/* Search & main content section */}
            <div className="flex-1">
              <ProjectSearchSection
                page={page}
                rows={rows}
                count={count}
                search={search}
                placeholder={keywords?.length ? 'Find within selection' : 'Find project'}
                layout={view}
                setView={setLayout}
                setModal={setModal}
              />
              {/* Project content: masonry, cards or list */}
              <ProjectOverviewContent
                layout={view}
                projects={projects}
              />
              {/* Pagination */}
              {numPages > 1 &&
                <div className="flex flex-wrap justify-center mt-8">
                  <Pagination
                    count={numPages}
                    page={page}
                    onChange={(_, page) => {
                      handleQueryChange('page',page.toString())
                    }}
                  />
                </div>
              }
            </div>
          </div>
        </MainContent>
        <AppFooter />
      </OverviewPageBackground>
      {/* filter for mobile */}
      {
        smallScreen===true &&
        <ProjectFiltersModal
          open={modal}
          filterCnt={getFilterCount()}
          orderBy={order ?? ''}
          keywords={keywords ?? []}
          keywordsList={keywordsList}
          domains={domains ?? []}
          domainsList={domainsList}
          organisations={organisations ?? []}
          organisationsList={organisationsList}
          setModal={setModal}
        />
      }
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let orderBy, offset=0
  // extract from page-query
  const {search, rows, page, keywords, domains, organisations, order} = ssrProjectsParams(context.query)
  // extract user settings from cookie
  const {rsd_page_layout, rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  let page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }
  if (order) {
    // extract order direction from definitions
    const orderInfo = projectOrderOptions.find(item=>item.key===order)
    if (orderInfo) orderBy=`${order}.${orderInfo.direction}`
  }

  const url = projectListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    domains,
    organisations,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // console.log('projects...url...', url)
  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('page_rows...', page_rows)
  // console.log('offset...', offset)

  // get project list and domains filter info,
  // 1. we do not pass the token
  // when token is passed it will return not published items too
  // 2. domains filter uses key values for filtering but
  // we also need labels to show in filter chips
  const [
    projects,
    keywordsList,
    domainsList,
    organisationsList
  ] = await Promise.all([
    getProjectList({url}),
    projectKeywordsFilter({search,keywords,domains,organisations}),
    projectDomainsFilter({search, keywords, domains, organisations}),
    projectParticipatingOrganisationsFilter({search, keywords, domains, organisations}),
  ])

  return {
    // pass this to page component as props
    props: {
      search,
      order,
      keywords,
      keywordsList,
      domains,
      domainsList,
      organisations,
      organisationsList,
      count: projects.count,
      page,
      rows: page_rows,
      layout: rsd_page_layout,
      projects: projects.data,
    },
  }
}
