// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import ProjectCard from '~/components/projects/ProjectCard'
import {OrganisationForOverview} from '~/types/Organisation'
import ProjectCardWithMenu from './ProjectCardWithMenu'
import useOrganisationProjects from './useOrganisationProjects'

type OrganisationProjectCardsProps = {
  organisation: OrganisationForOverview
  searchFor?:string
  page:number
  rows:number
  isMaintainer: boolean
  setCount:(count:number)=>void
}

export default function OrganisationProjectCards(props: OrganisationProjectCardsProps) {
  const {token} = useSession()
  const {organisation,searchFor,page,rows,isMaintainer,setCount} = props
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
  }, [count, loading, setCount])

  // show loader
  if (loading===true) return <ContentLoader />

  if (projects.length === 0
    && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }

  return (
    <>
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
    </>
  )
}
