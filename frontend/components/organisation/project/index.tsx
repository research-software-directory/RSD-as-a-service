import {useEffect} from 'react'

import {OrganisationForOverview} from '../../../types/Organisation'
import {Session} from '../../../auth'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import useOrganisationProjects from '../../../utils/useOrganisationProjects'
import ProjectsGrid from '../../projects/ProjectsGrid'
import GridScrim from '../../layout/GridScrim'

export default function OrganisationProjects({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
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

  if (loading){
    return (
      <GridScrim
        rows={rows}
        height='17rem'
        minWidth='25rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-2 pb-12"
      />
    )
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
