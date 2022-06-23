// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'
import {useRouter} from 'next/router'

import TablePagination from '@mui/material/TablePagination'

import {rowsPerPageOptions} from '../../config/pagination'
import {Project} from '../../types/Project'
import {getProjectList} from '../../utils/getProjects'
import {ssrProjectsParams} from '../../utils/extractQueryParam'
import {ssrProjectsUrl} from '../../utils/postgrestUrl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import PageTitle from '../../components/layout/PageTitle'
import ProjectGrid from '../../components/projects/ProjectsGrid'
import Searchbox from '../../components/form/Searchbox'

export default function ProjectsIndexPage({count,page,rows,projects=[]}:
  {count:number,page:number,rows:number,projects:Project[]
}) {
  const router = useRouter()

  function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    router.push(`/projects?page=${newPage}&rows=${rows}`)
  }

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    router.push(`/projects?page=0&rows=${parseInt(event.target.value)}`)
  }

  function handleSearch(searchFor:string){
    const url = ssrProjectsUrl({
      query: router.query,
      search: searchFor,
      // start from first page
      page: 0
    })
    router.push(url)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Projects | RSD</title>
      </Head>
      <PageTitle title="Projects">
        <div className="flex flex-wrap justify-end">
          <div className="flex items-center lg:ml-4">
            <Searchbox
              placeholder="Search for project"
              onSearch={handleSearch}
              />
          </div>
          <TablePagination
            component="nav"
            count={count}
            page={page}
            labelRowsPerPage="Per page"
            onPageChange={handleChangePage}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              paddingLeft:'1rem'
            }}
            />
        </div>
      </PageTitle>
      <ProjectGrid
        projects={projects}
        height='17rem'
        minWidth='26rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-4 pb-12"
      />
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {search, rows, page} = ssrProjectsParams(context)

  // make api call, we do not pass the token
  // when token is passed it will return not published items too
  const projects = await getProjectList({
    searchFor: search,
    rows,
    page,
    //baseUrl within docker network
    baseUrl: process.env.POSTGREST_URL
  })

  return {
    // pass this to page component as props
    props: {
      count: projects.count,
      page,
      rows,
      projects: projects.data
    },
  }
}
