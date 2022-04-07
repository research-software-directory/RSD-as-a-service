import {useState, useContext, useEffect} from 'react'
import SearchContext from '../components/search/SearchContext'
import PaginationContext from '../components/pagination/PaginationContext'

export default function usePaginationWithSearch(placeholder:string) {
  const {setPlaceholder, searchFor, setSearchInput, placeholder:currentPlaceholder} = useContext(SearchContext)
  const {pagination, setPagination} = useContext(PaginationContext)
  const [search, setSearch] = useState(searchFor)

  useEffect(() => {
    setPlaceholder(placeholder)
  },[placeholder,setPlaceholder])

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

  // TODO! reset page to 0 on firt request
  // useEffect(() => {
  //   if (placeholder !== currentPlaceholder) {
  //     // switch of placeholer means we need to reset pagination
  //     // as we moved to another section/page
  //     console.group('usePaginationWithSearch')
  //     console.log('placeholder...', placeholder)
  //     console.log('currentPlaceholder...', currentPlaceholder)
  //     console.log('pagination...', pagination)
  //     console.groupEnd()
  //     setPagination({
  //       ...pagination,
  //       page: 0,
  //       count:0
  //     })
  //   }
  // },[placeholder,currentPlaceholder, pagination,setPagination])

  function setCount(count: number) {
    // sync count from api and in the component
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
  }

  return {
    searchFor: search,
    page: pagination.page,
    rows: pagination.rows,
    setSearchInput,
    setPagination,
    setCount
  }
}
