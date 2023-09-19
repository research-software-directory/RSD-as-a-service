// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
      <MuiTableRow data-testid="mui-table-head-row">
        {columns.map((col, i) => {
          return (
            <MuiTableCell
              style={{cursor: col.type!=='custom' ? 'pointer' : 'default'}}
              key={`col-header-${i}`}
              align={col?.align ?? 'left'}
              onClick={() => col.type!=='custom' ? onSort(col.key) : null}
              sx={col?.sx}
            >
              {col.type!=='custom' ?
                <MuiTableSortLabel
                  active={col.order?.active}
                  direction={col.order?.direction}
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                </MuiTableSortLabel>
                :
                col.label
              }
            </MuiTableCell>
          )
        })}
      </MuiTableRow>
    </MuiTableHead>
  )
}
