// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'
import {useRouter} from 'next/router'

import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import {app} from '~/config/app'
import {rowsPerPageOptions} from '~/config/pagination'
import {ProjectSearchRpc} from '~/types/Project'
import {getProjectList} from '~/utils/getProjects'
import {ssrProjectsParams} from '~/utils/extractQueryParam'
import {projectListUrl, ssrProjectsUrl} from '~/utils/postgrestUrl'
import Searchbox from '~/components/form/Searchbox'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import ProjectKeywordFilter from '~/components/projects/ProjectKeywordFilter'

type ProjectsIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  projects: ProjectSearchRpc[],
  search?: string,
  keywords?: string[],
}

const pageTitle = `Projects | ${app.title}`

export default function ProjectsIndexPage(
  {projects=[], count, page, rows, search, keywords}: ProjectsIndexPageProps
) {
  // use next router (hook is only for browser)
  const router = useRouter()
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile
  const minWidth = smallScreen ? '18rem' : '29rem'

  // console.log('ProjectsIndexPage...projects...', projects)

  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    const url = ssrProjectsUrl({
      // take existing params from url (query)
      ...ssrProjectsParams(router.query),
      page: newPage,
    })
    router.push(url)
  }

  function handlePaginationChange(
    event: ChangeEvent<unknown>,
    newPage: number,
  ) {
    // Pagination component starts counting from 1, but we need to start from 0
    handleTablePageChange(event as any, newPage - 1)
  }

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    const url = ssrProjectsUrl({
      // take existing params from url (query)
      ...ssrProjectsParams(router.query),
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    router.push(url)
  }

  function handleSearch(searchFor:string){
    const url = ssrProjectsUrl({
      ...ssrProjectsParams(router.query),
      search: searchFor,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  function handleFilters(keywords:string[]){
    const url = ssrProjectsUrl({
      // take existing params from url (query)
      ...ssrProjectsParams(router.query),
      keywords,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PageTitle title="Projects">
        <div className="md:flex flex-wrap justify-end">
          <div className="flex items-center lg:ml-4">
            <Searchbox
              placeholder="Filter projects"
              onSearch={handleSearch}
              defaultValue={search}
            />
            <ProjectKeywordFilter
              items={keywords ?? []}
              onApply={handleFilters}
            />
          </div>
          <TablePagination
            component="nav"
            count={count}
            page={page}
            labelRowsPerPage="Per page"
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
        height='17rem'
        minWidth={minWidth}
        maxWidth='1fr'
        className="gap-[0.125rem] p-[0.125rem] pt-4 pb-12"
      />

      <div className="flex flex-wrap justify-center mb-5">
        <Pagination
          count={Math.ceil(count/rows)}
          page={page + 1}
          onChange={handlePaginationChange}
          size="large"
          shape="rounded"
        />
      </div>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {search, rows, page, keywords} = ssrProjectsParams(context.query)

  const url = projectListUrl({
    baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
    search,
    keywords,
    order: 'current_state.desc,date_start.desc,title',
    limit: rows,
    offset: rows * page,
  })

  // get project list, we do not pass the token
  // when token is passed it will return not published items too
  const projects = await getProjectList({url})

  return {
    // pass this to page component as props
    props: {
      search,
      keywords,
      count: projects.count,
      page,
      rows,
      projects: projects.data,
    },
  }
}
