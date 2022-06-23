// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {OrganisationForOverview} from '../../../types/Organisation'
import {Session} from '../../../auth'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import useOrganisationProjects from '../../../utils/useOrganisationProjects'
import ProjectsGrid from '../../projects/ProjectsGrid'
import NoContent from '~/components/layout/NoContent'

export default function OrganisationProjects({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const [init,setInit]=useState(true)
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for projects')
  const {loading, projects, count} = useOrganisationProjects({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

  useEffect(() => {
    setInit(false)
  },[])

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  if (projects.length === 0
    && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }


  return (
    <ProjectsGrid
      projects={projects}
      height='17rem'
      minWidth='25rem'
      maxWidth='1fr'
      className="gap-[0.125rem] pt-2 pb-12"
    />
  )
}
