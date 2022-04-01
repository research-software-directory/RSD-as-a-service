import {MouseEvent, ChangeEvent} from 'react'
import {useState} from 'react'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'

import {rowsPerPageOrganisation} from '../../../config/pagination'
import {OrganisationForOverview} from '../../../types/Organisation'
import {Session} from '../../../auth'
import Searchbox from '../../form/Searchbox'
import useOrganisationProjects from '../../../utils/useOrganisationProjects'
import ProjectsGrid from '../../projects/ProjectsGrid'
import GridScrim from '../../layout/GridScrim'

type SearchState = {
  searchFor?: string
  page: number
  rows: number
}

export default function OrganisationProjects({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const [searchState, setSearchStrate] = useState<SearchState>({
    searchFor: undefined,
    page: 0,
    rows: 6
  })
  const {searchFor, page, rows} = searchState
  const {loading, projects, count} = useOrganisationProjects({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    setSearchStrate({
      ...searchState,
      page: newPage
    })
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setSearchStrate({
      ...searchState,
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
  }

  function handleSearch(searchFor: string) {
    setSearchStrate({
      ...searchState,
      // reset to first page
      page: 0,
      searchFor
    })
  }

  function renderLoader() {
    if (loading) return <CircularProgress />
    return null
  }

  function renderGrid(){
    if (loading){
      return (
        <GridScrim
          rows={rows}
          height='15rem'
          minWidth='25rem'
          maxWidth='1fr'
          className="gap-[0.125rem] pt-8 pb-12"
        />
      )
    }
    return (
      <ProjectsGrid
        projects={projects}
        minWidth='25rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-8 pb-12"
      />
    )
  }

  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap justify-end">
        {renderLoader()}
        <div className="flex items-center">
          <Searchbox
            placeholder='Search for projects'
            onSearch={handleSearch}
          />
        </div>
        <TablePagination
          component="nav"
          count={count}
          page={page}
          labelRowsPerPage="Per page"
          onPageChange={handlePageChange}
          rowsPerPage={rows}
          rowsPerPageOptions={rowsPerPageOrganisation}
          onRowsPerPageChange={handleItemsPerPage}
        />
      </div>
      {renderGrid()}
    </section>
  )
}
