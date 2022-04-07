import {useContext, useEffect} from 'react'

import SearchContext from '../../search/SearchContext'
import PaginationContext from '../../pagination/PaginationContext'
import {OrganisationForOverview} from '../../../types/Organisation'
import {Session} from '../../../auth'
import useOrganisationProjects from '../../../utils/useOrganisationProjects'
import ProjectsGrid from '../../projects/ProjectsGrid'
import GridScrim from '../../layout/GridScrim'

export default function OrganisationProjects({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const {setPlaceholder, searchFor, setSearchFor, setSearchInput} = useContext(SearchContext)
  const {pagination, setPagination} = useContext(PaginationContext)
  const {page, rows} = pagination
  const {loading, projects, count} = useOrganisationProjects({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

  useEffect(() => {
    setPlaceholder('Search for projects')
  },[setPlaceholder,setSearchFor,setSearchInput])

  useEffect(() => {
    if (pagination.count !== count) {
      if (count === 0) {
        setPagination({
          ...pagination,
          // reset page value
          page:0,
          count
        })
      } else {
        setPagination({
          ...pagination,
          count
        })
      }
    }
  },[pagination,count,setPagination])

  if (loading){
    return (
      <GridScrim
        rows={rows}
        height='15rem'
        minWidth='25rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-2 pb-12"
      />
    )
  }

  return (
    <ProjectsGrid
      projects={projects}
      minWidth='25rem'
      maxWidth='1fr'
      className="gap-[0.125rem] pt-2 pb-12"
    />
  )
}
