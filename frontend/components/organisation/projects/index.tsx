// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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
import ContentLoader from '~/components/layout/ContentLoader'
import UserAgrementModal from '~/components/user/UserAgreementModal'

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

  // console.group('OrganisationProjects')
  // console.log('loading...', loading)
  // console.log('projects...', projects)
  // console.log('count')
  // console.groupEnd()

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  // show loader
  if (loading===true) return <ContentLoader />

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
      <UserAgrementModal />
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
