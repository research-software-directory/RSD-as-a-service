// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent,MouseEvent} from 'react'
import TablePagination from '@mui/material/TablePagination'

import {setDocumentCookie} from '~/utils/userSettings'
import {usePaginationContext} from './PaginationContext'

export default function Pagination() {
  const {count,page,rows,rowsOptions,labelRowsPerPage, setPagination} = usePaginationContext()

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    setPagination({
      count,
      rows,
      rowsOptions,
      labelRowsPerPage,
      page: newPage
    })
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPagination({
      count,
      rowsOptions,
      labelRowsPerPage,
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    // save change to cookie
    setDocumentCookie(event.target.value,'rsd_page_rows')
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
