// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useContext, useEffect} from 'react'
import SearchContext from '~/components/search/SearchContext'
import PaginationContext from '~/components/pagination/PaginationContext'

export default function usePaginationWithSearch(placeholder:string) {
  const {setPlaceholder, searchFor, setSearchInput, placeholder:currentPlaceholder} = useContext(SearchContext)
  const {pagination, setPagination} = useContext(PaginationContext)
  const [search, setSearch] = useState(searchFor)


  // console.group('usePaginationWithSearch')
  // console.log('searchFor...',searchFor)
  // console.log('search...',search)
  // console.log('pagination...',pagination)
  // console.groupEnd()


  useEffect(() => {
    if (placeholder !== currentPlaceholder) {
      // first reset page to 0
      if (pagination.count !== 0) {
        setPagination({
          ...pagination,
          page: 0,
          count: 0
        })
      }
      // change placeholder
      setPlaceholder(placeholder)
    }
  },[placeholder,currentPlaceholder,setPlaceholder,pagination,setPagination])

  useEffect(() => {
    // sync search passed from Searchbox component
    // and the local value to be passed to consumers
    if (searchFor !== search) {
      // reset to page & count zero
      setPagination({
        ...pagination,
        page: 0,
        count: 0
      })
      // pass new search term
      setSearch(searchFor)
    }
  }, [searchFor, search, pagination, setPagination])

  function setCount(count: number) {
    // sync count from api and in the component
    // console.log('usePaginationWithSearch.setCount...', count)
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

  function setPage(page: number) {
    setPagination({
      ...pagination,
      page
    })
  }

  return {
    searchFor: search,
    // when navigating between sections we need to reset page to 0
    // assumption: placeholder change is result of switching between sections
    page: placeholder !== currentPlaceholder ? 0 : pagination.page,
    rows: pagination.rows,
    count: pagination.count,
    setSearchInput,
    // setPagination,
    setCount,
    setPage
  }
}
