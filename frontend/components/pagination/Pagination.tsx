// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent,useContext,MouseEvent} from 'react'
import TablePagination from '@mui/material/TablePagination'

import PaginationContext from './PaginationContext'

export default function Pagination() {
  const {pagination, setPagination} = useContext(PaginationContext)
  const {count,page,rows,rowsOptions,labelRowsPerPage} = pagination

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    setPagination({
      ...pagination,
      page: newPage
    })
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPagination({
      ...pagination,
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
  }

  return (
    <TablePagination
      component="nav"
      count={count}
      page={page}
      labelRowsPerPage={labelRowsPerPage}
      onPageChange={handlePageChange}
      rowsPerPage={rows}
      rowsPerPageOptions={rowsOptions}
      onRowsPerPageChange={handleItemsPerPage}
    />
  )
}
