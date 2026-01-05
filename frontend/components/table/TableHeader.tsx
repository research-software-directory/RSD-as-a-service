// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import MuiTableHead from '@mui/material/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import MuiTableCell from '@mui/material/TableCell'
import MuiTableSortLabel from '@mui/material/TableSortLabel'

import {Column} from './EditableTable'

type HeaderCellType<T,K extends keyof T> = Readonly<{
  column: Column<T, K>
  onSort: (column: K) => void
}>

function HeaderCell<T, K extends keyof T>({column,onSort}: HeaderCellType<T,K>){
  switch (true){
    // if headerFn present it has priority
    case typeof(column?.headerFn)=='function':
      return column.headerFn()
    // custom type cannot be sorted (use to disable sort option)
    case column.type === 'custom':
      return <span>{column.label}</span>
    // all other column types are sortable
    default:
      return (
        <MuiTableSortLabel
          active={column.order?.active}
          direction={column.order?.direction}
          onClick={() => onSort(column.key)}
        >
          {column.label}
        </MuiTableSortLabel>
      )
  }
}


export default function TableHeader<T, K extends keyof T>({columns, onSort}:
{columns: Column<T, K>[], onSort:(column:K)=>void}) {
  return (
    <MuiTableHead>
      <MuiTableRow data-testid="mui-table-head-row">
        {columns.map((col, i) => {
          return (
            <MuiTableCell
              key={`col-header-${i}`}
              align={col?.align ?? 'left'}
              // style={{cursor: col.type!=='custom' ? 'pointer' : 'default'}}
              // onClick={() => col.type!=='custom' ? onSort(col.key) : null}
              sx={col?.sx}
            >
              <HeaderCell
                column={col}
                onSort={onSort}
              />
            </MuiTableCell>
          )
        })}
      </MuiTableRow>
    </MuiTableHead>
  )
}
