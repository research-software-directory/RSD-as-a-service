// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useState, useEffect, useContext} from 'react'
import {useDebounce} from '~/utils/useDebounce'

export type SearchContextProps = {
  placeholder: string,
  searchInput: string,
  searchFor: string,
  delay?: number,
  setSearchFor: (searchFor: string|undefined) => void
  setPlaceholder: (placeholder: string) => void
  setDelay: (delay: number) => void
  setSearchInput: (input:string) => void
}

export const initSearch = {
  placeholder: 'Search',
  searchFor: null,
  delay: 400
}

const SearchContext = createContext<SearchContextProps>({
  placeholder: 'Search',
  searchInput: '',
  searchFor:'',
  delay: 400,
  setDelay: () => { },
  setSearchFor: () => { },
  setPlaceholder: () => { },
  setSearchInput: () => { }
})

export function SearchProvider(props:any) {
  const [searchInput, setSearchInput] = useState('')
  const [searchFor, setSearchFor] = useState<string>()
  const [placeholder, setPlaceholder] = useState('Search')
  const [delay, setDelay] = useState(400)

  // debounce input value
  const search=useDebounce(searchInput, delay ?? 400)

  useEffect(()=>{
    if (searchInput === search) {
      setSearchFor(search)
    }
  }, [searchInput, search, setSearchFor])

  // debugger
  // console.group('SearchProvider')
  // console.log('searchInput...', searchInput)
  // console.log('searchFor...', searchFor)
  // console.log('placeholder...', placeholder)
  // console.groupEnd()

  return <SearchContext.Provider value={{
    searchInput,
    searchFor,
    placeholder,
    delay,
    setSearchFor,
    setPlaceholder,
    setDelay,
    setSearchInput
  }}
  // we pass children etc...
  {...props}
  />
}


export function useSearchContext(newPlaceholder:string){
  const {setPlaceholder, searchFor, setSearchInput, placeholder} = useContext(SearchContext)

  useEffect(()=>{
    // update placeholder in the context
    if (placeholder!=newPlaceholder){
      setPlaceholder(newPlaceholder)
    }
  },[placeholder,newPlaceholder,setPlaceholder])

  return {
    searchFor,
    placeholder,
    setPlaceholder,
    setSearchInput
  }

}


export default SearchContext
