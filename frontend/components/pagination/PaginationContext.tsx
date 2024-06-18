// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext, useState} from 'react'
import {rowsPerPageOptions} from '~/config/pagination'
import {getDocumentCookie} from '~/utils/userSettings'

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
  // get user value out of cookie or use default
  const rsd_page_rows = parseInt(getDocumentCookie('rsd_page_rows',initState.rows))
  // use initState and update with pagination if passed in props
  const state = {
    // use initial state as base
    ...initState,
    // overwrite with info from cookie
    rows: rsd_page_rows,
    // finally use pagination if provided
    ...props?.pagination
  }
  const [pagination, setPagination] = useState<Pagination>(state)

  // console.group('PaginationProvider')
  // console.log('props...', props)
  // console.log('state...', state)
  // console.log('pagination...', pagination)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.groupEnd()

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
