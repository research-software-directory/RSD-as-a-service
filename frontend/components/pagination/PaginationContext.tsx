// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useContext, useState} from 'react'
import {rowsPerPageOptions} from '~/config/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'

type Pagination = {
  count: number,
  page: number,
  rows: number,
  rowsOptions: number[],
  labelRowsPerPage: string
}

export type PaginationContextProps = {
  pagination: Pagination,
  setPagination: (state:Pagination)=>void
}

export const initState = {
  count: 0,
  page: 0,
  rows: rowsPerPageOptions[0],
  rowsOptions: rowsPerPageOptions,
  labelRowsPerPage:'Items'
}

const PaginationContext = createContext<PaginationContextProps>({
  pagination: initState,
  setPagination: ()=>{}
})

export function PaginationProvider(props: any) {
  const state={
    ...initState,
    ...props?.pagination
  }
  // need to use initState if initPagination NOT PROVIDED
  const [pagination, setPagination] = useState<Pagination>(state)

  // console.group('PaginationProvider')
  // console.log('props...', props)
  // console.log('state...', state)
  // console.log('pagination...', pagination)
  // console.groupEnd()

  return <PaginationContext.Provider
    value={{pagination,setPagination}}
    {...props}
  />
}


export function usePaginationContext() {
  const {setPageRows} = useUserSettings()
  const {pagination, setPagination} = useContext(PaginationContext)

  // console.group('usePaginationContext')
  // console.log('pagination...', pagination)
  // console.log('search...', search)
  // console.groupEnd()

  function setPage(page:number){
    setPagination({
      ...pagination,
      page
    })
  }

  function setCount(count:number){
    if (count === 0){
      setPagination({
        ...pagination,
        // reset page to 0 too
        page:0,
        count,
      })
    }else{
      setPagination({
        ...pagination,
        count,
      })
    }
  }

  function setRows(rows:number){
    // save number of rows in user settings (saves to cookie too)
    setPageRows(rows)

    setPagination({
      ...pagination,
      // reset to first page
      page: 0,
      rows
    })
  }

  return {
    ...pagination,
    setPage,
    setRows,
    setCount
  }
}


export default PaginationContext
