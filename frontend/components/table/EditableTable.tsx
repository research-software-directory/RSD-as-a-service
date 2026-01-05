// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {SxProps, Theme} from '@mui/system'
import Table from '@mui/material/Table'
import TableBody from './TableBody'
import TableHeader from './TableHeader'
import {UpdateProps} from './EditableCell'

// typing based on this article
// https://www.bekk.christmas/post/2020/22/create-a-generic-table-with-react-and-typescript

export type OrderProps = {
  active: boolean,
  direction: 'asc'|'desc'
}

export type ColType = 'string' | 'date' | 'datetime' | 'boolean' | 'custom' | 'command'

export type Column<T,K extends keyof T> = {
  key: K
  label: string
  type: ColType
  align?: 'left'|'right'|'center'|'justify'
  className?: string
  sx?: SxProps<Theme>
  order?: OrderProps
  patchFn?: (props: UpdateProps) => Promise<{status: number, message: string}>
  disabledFn?: (props: UpdateProps) => boolean
  renderFn?: (data:T) => JSX.Element
  headerFn?: () => JSX.Element
}

export type OrderByProps<T,K extends keyof T> = {
  column: K,
  direction: 'asc'|'desc'
}

export type MuiTableProps<T extends {id:string,origin?:string}, K extends keyof T>={
  columns: Column<T, K>[],
  data: T[]
  onSort: (column: K) => void
  className?: string
  stickyHeader?: boolean
  sx?: SxProps<Theme>
}

export default function EditableTable<T extends {id: string, origin?:string}, K extends keyof T>({
  columns, data, onSort, className='w-full mb-8 text-sm', stickyHeader=false, sx}: MuiTableProps<T, K>) {

  return (
    <Table
      stickyHeader={stickyHeader}
      className={className}
      sx={sx}
    >
      <TableHeader
        onSort={onSort}
        columns={columns}
      />
      <TableBody columns={columns} data={data} />
    </Table>
  )
}
