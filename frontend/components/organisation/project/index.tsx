// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {OrganisationPageProps} from 'pages/organisations/[...slug]'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import useOrganisationProjects from '../../../utils/useOrganisationProjects'
import NoContent from '~/components/layout/NoContent'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'
import ProjectCardWithMenu from './ProjectCardWithMenu'
import ProjectCard from '~/components/projects/ProjectCard'

export default function OrganisationProjects({organisation, session, isMaintainer}:OrganisationPageProps) {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for projects')
  const {loading, projects, count} = useOrganisationProjects({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

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
    <FlexibleGridSection
      height='17rem'
      minWidth='25rem'
      maxWidth='1fr'
      className="gap-[0.125rem] pt-2 pb-12"
    >
      {projects.map(item => {
        if (isMaintainer) {
          return (
            <ProjectCardWithMenu
              key={item.slug}
              organisation={organisation}
              item={item}
              token={session.token}
            />
          )
        }
        return (
          <ProjectCard
            key={item.id}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
