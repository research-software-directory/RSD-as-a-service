import {MouseEvent, ChangeEvent, useContext, useEffect} from 'react'
import {useState} from 'react'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'

import {rowsPerPageOrganisation} from '../../../config/pagination'
import {OrganisationForOverview} from '../../../types/Organisation'
import {Session} from '../../../auth'
import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import SoftwareGrid from './SoftwareGrid'
import GridScrim from '../../layout/GridScrim'

import SearchContext from '../../search/SearchContext'

type SearchState = {
  searchFor?: string
  page: number
  rows: number
}

export default function OrganisationSoftware({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const {setPlaceholder, searchFor, setSearchInput} = useContext(SearchContext)
  const [searchState, setSearchState] = useState<SearchState>({
    searchFor: undefined,
    page: 0,
    rows: 6
  })
  const {page, rows} = searchState
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

  useEffect(() => {
    setPlaceholder('Search for software')
    // setSearchInput('')
  },[setPlaceholder,setSearchInput])

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    setSearchState({
      ...searchState,
      page: newPage
    })
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setSearchState({
      ...searchState,
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
  }

  function handleSearch(searchFor: string) {
    setSearchState({
      ...searchState,
      // reset to first page
      page: 0,
      searchFor
    })
  }

  function renderLoader() {
    // debugger
    if (loading) return <CircularProgress sx={{margin:'0rem 2rem 0rem 2rem'}} />
    return null
  }

  function renderGrid(){
    if (loading){
      return (
        <GridScrim
          rows={rows}
          height='17rem'
          minWidth='25rem'
          maxWidth='1fr'
          className="gap-[0.125rem] pt-8 pb-12"
        />
      )
    }
    return (
      <SoftwareGrid
        software={software}
        minWidth='25rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-8 pb-12"
      />
    )
  }

  return (
    <section className="flex flex-col flex-1">
      <div className="flex flex-wrap justify-end">
        {renderLoader()}
        <div className="flex items-center">
          {/* <Searchbox
            placeholder='Search for software'
            onSearch={handleSearch}
          /> */}
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
