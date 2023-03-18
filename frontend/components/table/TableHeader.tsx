// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import MuiTableHead from '@mui/material/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import MuiTableCell from '@mui/material/TableCell'
import MuiTableSortLabel from '@mui/material/TableSortLabel'

import {Column} from './EditableTable'

export default function TableHeader<T, K extends keyof T>({columns, onSort}:
  {columns: Column<T, K>[], onSort:(column:K)=>void}) {
   return (
    <MuiTableHead>
      <MuiTableRow>
        {columns.map((col, i) => {
          return (
            <MuiTableCell
              style={{cursor:'pointer'}}
              key={`col-header-${i}`}
              align={col?.align ?? 'left'}
              onClick={() => onSort(col.key)}
              sx={col?.sx}
            >
               <MuiTableSortLabel
                  active={col.order?.active}
                  direction={col.order?.direction}
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                </MuiTableSortLabel>
            </MuiTableCell>
          )
        })}
      </MuiTableRow>
    </MuiTableHead>
  )
}
