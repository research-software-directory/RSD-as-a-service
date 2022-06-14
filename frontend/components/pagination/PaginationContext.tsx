// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useState,} from 'react'
import {rowsPerPageOrganisation} from '../../config/pagination'

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
  rows: rowsPerPageOrganisation[0],
  rowsOptions: rowsPerPageOrganisation,
  labelRowsPerPage:'Per page'
}

const PaginationContext = createContext<PaginationContextProps>({
  pagination: initState,
  setPagination: ()=>{}
})

export function PaginationProvider(props: any) {
  const [pagination, setPagination] = useState(initState)

  // console.group('PaginationProvider')
  // console.log('pagination...', pagination)
  // console.groupEnd()

  return <PaginationContext.Provider
    value={{pagination,setPagination}}
    {...props}
  />
}

export default PaginationContext
