// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {useSession} from '~/auth'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useOrganisationProjects from './useOrganisationProjects'
import NoContent from '~/components/layout/NoContent'
import FlexibleGridSection, {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import ProjectCardWithMenu from './ProjectCardWithMenu'
import ProjectCard from '~/components/projects/ProjectCard'
import {OrganisationComponentsProps} from '../OrganisationNavItems'

export default function OrganisationProjects({organisation, isMaintainer}:OrganisationComponentsProps) {
  const {token} = useSession()
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions()
  const {searchFor,page,rows,setCount} = usePaginationWithSearch(`Find project in ${organisation.name}`)
  const {loading, projects, count} = useOrganisationProjects({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token,
    isMaintainer
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
      height={itemHeight}
      minWidth={minWidth}
      maxWidth={maxWidth}
      className="gap-[0.125rem] p-[0.125rem] pt-2 pb-12"
    >
      {projects.map(item => {
        if (isMaintainer) {
          return (
            <ProjectCardWithMenu
              key={item.slug}
              organisation={organisation}
              item={item}
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
