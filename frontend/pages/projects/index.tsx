// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import {GetServerSidePropsContext} from 'next'
import {useRouter} from 'next/router'

import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'

import {app} from '~/config/app'
import {rowsPerPageOptions} from '~/config/pagination'
import {ProjectSearchRpc} from '~/types/Project'
import {getProjectList} from '~/utils/getProjects'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {projectListUrl, ssrProjectsUrl} from '~/utils/postgrestUrl'
import {getBaseUrl} from '~/utils/fetchHelpers'
import Searchbox from '~/components/form/Searchbox'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import ProjectFilter from '~/components/projects/filter'
import {getResearchDomainInfo, ResearchDomain} from '~/components/projects/filter/projectFilterApi'
import {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {getUserSettings, setDocumentCookie} from '~/components/software/overview/userSettings'
import useProjectOverviewParams from '~/components/projects/overview/useProjectOverviewParams'

type ProjectsIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  projects: ProjectSearchRpc[],
  search?: string,
  keywords?: string[],
  domains?: ResearchDomain[]
}

const pageTitle = `Projects | ${app.title}`
const pageDesc = 'The list of research projects registerd in the Research Software Directory.'

export default function ProjectsIndexPage(
  {projects=[], count, page, rows, search, keywords,domains}: ProjectsIndexPageProps
) {
  // use next router (hook is only for browser)
  const router = useRouter()
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions()
  const {handleQueryChange} = useProjectOverviewParams()
  const numPages = Math.ceil(count / rows)

  // console.group('ProjectsIndexPage')
  // console.log('query...', router.query)
  // console.groupEnd()

  function handleTablePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    // Pagination component starts counting from 0, but we need to start from 1
    handleQueryChange('page',(newPage + 1).toString())
  }

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    handleQueryChange('rows',event.target.value)
    // save to cookie
    setDocumentCookie(event.target.value,'rsd_page_rows')
  }

  function handleSearch(searchFor: string) {
    handleQueryChange('search',searchFor)
  }

  function handleFilters({keywords,domains}:{keywords: string[],domains:string[]}){
    const url = ssrProjectsUrl({
      // take existing params from url (query)
      ...ssrProjectsParams(router.query),
      keywords,
      domains,
      // start from first page
      page: 1,
    })
    router.push(url)
  }

  return (
    <DefaultLayout>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      <CanonicalUrl/>
      <PageTitle title="Projects">
        <div className="md:flex flex-wrap justify-end">
          <div className="flex items-center lg:ml-4">
            <ProjectFilter
              keywords={keywords ?? []}
              domains={domains ?? []}
              onApply={handleFilters}
            />
            <Searchbox
              placeholder={keywords?.length || domains?.length ? 'Find within selection' : 'Find project'}
              onSearch={handleSearch}
              defaultValue={search}
            />
          </div>
          <TablePagination
            component="nav"
            count={count}
            page={page-1}
            labelRowsPerPage="Items"
            onPageChange={handleTablePageChange}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              paddingLeft:'1rem'
            }}
            />
        </div>
      </PageTitle>

      <ProjectsGrid
        projects={projects}
        height={itemHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        className="gap-[0.125rem] p-[0.125rem] pt-4 pb-12"
      />

      {numPages > 1 &&
        <div className="flex flex-wrap justify-center mb-8">
          <Pagination
            count={numPages}
            page={page}
            onChange={(_, page) => {
              handleQueryChange('page',page.toString())
            }}
          />
        </div>
      }
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  let offset=0
  // extract from page-query
  const {search, rows, page, keywords, domains} = ssrProjectsParams(context.query)
  // extract user settings from cookie
  const {rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  let page_rows = rows ?? rsd_page_rows
  // calculate offset when page & rows present
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }

  const url = projectListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    domains,
    // when search is used the order is already applied in the rpc
    order: search ? undefined : 'current_state.desc,date_start.desc,title',
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
  const [projects, domainsInfo] = await Promise.all([
    getProjectList({url}),
    getResearchDomainInfo(domains)
  ])

  return {
    // pass this to page component as props
    props: {
      search,
      keywords,
      domains: domainsInfo,
      count: projects.count,
      page,
      rows: page_rows,
      projects: projects.data,
    },
  }
}
