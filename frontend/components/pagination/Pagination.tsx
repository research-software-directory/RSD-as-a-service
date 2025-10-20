// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {ChangeEvent,MouseEvent} from 'react'
import TablePagination from '@mui/material/TablePagination'

import {usePaginationContext} from './PaginationContext'

export default function Pagination() {
  const {count,page,rows,rowsOptions,labelRowsPerPage,setPage,setRows} = usePaginationContext()

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    setPage(newPage)
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setRows(Number.parseInt(event.target.value))
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
