// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent,ChangeEvent, useState, useEffect} from 'react'
import TablePagination from '@mui/material/TablePagination'

import {rowsPerPageOptions} from '~/config/pagination'
import Searchbox from '~/components/form/Searchbox'
import useCitationsForSoftware from './useCitationsBySoftware'
import CitationItem from './CitationItem'
import {useCitationCnt} from './TabCountsProvider'
import NoCitations from './NoCitations'

export default function CitationBySoftware() {
  const [query,setQuery] = useState({
    search: '',
    rows: 12,
    page: 0
  })
  const {citations,count,loading} = useCitationsForSoftware(query)
  const {setCitationCnt} = useCitationCnt()

  useEffect(()=>{
    if (count) {
      setCitationCnt(count)
    }
  },[count,setCitationCnt])

  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    // Pagination component starts counting from 0, but we need to start from 1
    // handleQueryChange('page',(newPage + 1).toString())
    setQuery({
      ...query,
      page: newPage
    })
  }

  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setQuery({
      ...query,
      rows: parseInt(event.target.value),
      // reset to first page when changing
      page: 0
    })
  }

  function handleSearch(searchFor: string) {
    setQuery({
      ...query,
      search: searchFor,
      // reset to first page when changing
      page: 0
    })
  }

  if (citations?.length===0 && loading===false){
    return <div className="mt-4"><NoCitations /></div>
  }

  return (
    <>
      <div className="md:flex flex-wrap justify-end mt-4">
        <div className="flex-1 flex items-center ml-4">
          <Searchbox
            placeholder='Find citation'
            onSearch={handleSearch}
            defaultValue={query.search}
          />
        </div>
        <TablePagination
          component="nav"
          count={count ?? 0}
          // uses 0 based index
          page={query.page ?? 0}
          labelRowsPerPage="Items"
          onPageChange={handleTablePageChange}
          rowsPerPage={query.rows}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleItemsPerPage}
        />
      </div>
      <div className="overflow-auto">
        {
          citations?.map(item=>{
            return <CitationItem key={item.id} item={item} />
          })
        }
      </div>
    </>
  )
}
