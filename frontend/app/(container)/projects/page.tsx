import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {projectListUrl} from '~/utils/postgrestUrl'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {getProjectList} from '~/components/projects/apiProjects'
import {
  projectDomainsFilter,
  projectKeywordsFilter,
  projectParticipatingOrganisationsFilter,
  projectStatusFilter
} from '~/components/projects/overview/filters/projectFiltersApi'
import {projectOrderOptions} from '~/components/projects/overview/filters/projectOrderOptions'
import ProjectFilters from '~/components/projects/overview/filters'
import ProjectSearchSection from '~/components/projects/overview/search/ProjectSearchSection'
import ProjectOverviewContent from '~/components/projects/overview/ProjectOverviewContent'

export const metadata: Metadata = {
  title: `Projects | ${app.title}`,
  description: 'The list of research projects in the Research Software Directory.'
}

export default async function ProjectsOverviewPage({
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}>) {
  // extract params, user preferences and active modules
  const [params, {rsd_page_rows},modules] = await Promise.all([
    searchParams,
    getUserSettings(),
    getActiveModuleNames()
  ])

  // show 404 page if module is not enabled
  if (modules?.includes('projects')===false){
    notFound()
  }

  // extract from page-query
  const {
    search, rows, page, keywords, domains,
    organisations, project_status, order
  } = ssrProjectsParams(params)

  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  let offset=0
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }
  const allowedOrderings = projectOrderOptions.map(o => o.key)
  // default order
  let projectOrder = order ?? 'impact_cnt'
  // remove order key if NOT in list of allowed
  if (order && allowedOrderings.includes(order)===false) {
    projectOrder = 'impact_cnt'
  }

  // extract order direction from definitions
  const orderInfo = projectOrderOptions.find(item=>item.key===projectOrder)!
  // ordering options require "stable" secondary order
  // to ensure proper pagination. We use slug for this purpose
  const orderBy = `${projectOrder}.${orderInfo.direction},slug.asc`

  const url = projectListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    domains,
    organisations,
    project_status,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // get project list and domains filter info,
  // 1. we do not pass the token
  // when token is passed it will return not published items too
  // 2. domains filter uses key values for filtering but
  // we also need labels to show in filter chips
  const [
    projects,
    keywordsList,
    domainsList,
    organisationsList,
    projectStatusList
  ] = await Promise.all([
    getProjectList({url}),
    projectKeywordsFilter({search,keywords,domains,organisations,project_status}),
    projectDomainsFilter({search, keywords, domains, organisations,project_status}),
    projectParticipatingOrganisationsFilter({search, keywords, domains, organisations,project_status}),
    projectStatusFilter({search, keywords, domains, organisations})
  ])

  const numPages = Math.ceil(projects.count / page_rows)
  const filterCnt = getFilterCount()

  // console.group('ProjectsOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('domains...', domains)
  // console.log('organisations...', organisations)
  // console.log('order...', projectOrder)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('keywordsList...', keywordsList)
  // console.log('domainsList...', domainsList)
  // console.log('organisationsList...', organisationsList)
  // console.log('project_status...', project_status)
  // console.log('projectStatusList...', projectStatusList)
  // console.log('projects...', projects)
  // console.groupEnd()

  function getFilterCount() {
    let count = 0
    if (keywords) count++
    if (domains) count++
    if (organisations) count++
    if (search) count++
    if (project_status) count++
    return count
  }

  return (
    <>
      <h1 className="mt-8">
        All projects
      </h1>

      <div className="flex-1 grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] my-4 gap-8">
        {/* Filters panel on the left */}
        <FiltersPanel>
          <ProjectFilters
            filterCnt={filterCnt}
            orderBy={projectOrder ?? ''}
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            domains={domains ?? []}
            domainsList={domainsList}
            organisations={organisations ?? []}
            organisationsList={organisationsList}
            status={project_status ?? ''}
            statusList={projectStatusList}
          />
        </FiltersPanel>

        {/* Search & main content section */}
        <div className="flex-1 flex flex-col">
          <ProjectSearchSection
            count={projects.count}
            filterModal={
              <ProjectFilters
                filterCnt={filterCnt}
                orderBy={projectOrder ?? ''}
                keywords={keywords ?? []}
                keywordsList={keywordsList}
                domains={domains ?? []}
                domainsList={domainsList}
                organisations={organisations ?? []}
                organisationsList={organisationsList}
                status={project_status ?? ''}
                statusList={projectStatusList}
              />
            }
          />

          {/* Project content: masonry, cards or list */}
          <ProjectOverviewContent
            projects={projects.data}
          />

          {/* Pagination */}
          <PaginationLinkApp
            count={numPages}
            page={page ?? 1}
            className='mt-4'
          />
        </div>
      </div>
    </>
  )
}
