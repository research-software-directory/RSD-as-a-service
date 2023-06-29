// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext, useEffect, useState,} from 'react'
import {rowsPerPageOptions} from '../../config/pagination'

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
  const {pagination: initPagination} = props
  // need to use initState if initPagination NOT PROVIDED
  const [pagination, setPagination] = useState(initPagination ?? initState)

  // console.group('PaginationProvider')
  // console.log('pagination...', pagination)
  // console.groupEnd()

  useEffect(() => {
    // update pagination state with new inital value
    if (initPagination) setPagination(initPagination)
  },[initPagination])


  return <PaginationContext.Provider
    value={{pagination,setPagination}}
    {...props}
  />
}


export function usePaginationContext() {
  const {pagination, setPagination} = useContext(PaginationContext)

  // console.group('usePaginationContext')
  // console.log('pagination...', pagination)
  // console.groupEnd()

  return {
    ...pagination,
    setPagination
  }
}


export default PaginationContext
