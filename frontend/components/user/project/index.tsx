// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next'

import {Session} from '~/auth'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import ContentLoader from '~/components/layout/ContentLoader'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import {getProjectList} from '~/utils/getProjects'
import {ssrProjectsParams} from '~/utils/extractQueryParam'

import useUserProjects from './useUserProjects'

export default function UserProjects({session}: {session: Session}) {
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Search for project')
  const {loading, projects, count} = useUserProjects({
    searchFor,
    page,
    rows,
    session
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // do not use loader for now
  // because the layout jumps up-and-down
  // on pagination
  // if (loading) {
  //   return (
  //     <ContentLoader />
  //   )
  // }

  return (
    <ProjectsGrid
      projects={projects}
      height='17rem'
      minWidth='26rem'
      maxWidth='1fr'
      className="gap-[0.125rem] pt-4 pb-12"
    />
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {search, rows, page} = ssrProjectsParams(context)

  // make api call
  const projects = await getProjectList({
    searchFor: search,
    rows: rows,
    page: page,
    baseUrl: process.env.POSTGREST_URL
  })

  return {
    // pass this to page component as props
    props: {
      count: projects.count,
      rows: rows,
      page: page,
      projects: projects.data
    },
  }
}
