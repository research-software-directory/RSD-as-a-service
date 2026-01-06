// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import MuiTableBody from '@mui/material/TableBody'
import MuiTableRow from '@mui/material/TableRow'
import MuiTableCell from '@mui/material/TableCell'

import logger from '~/utils/logger'
import {Column} from './EditableTable'
import EditableCell from './EditableCell'

function formatValue<T, K extends keyof T>(col: Column<T, K>, value: any) {
  if (value===null || typeof value==='undefined') return ''
  let formattedValue = ''
  try {
    switch (col.type) {
      case 'date':
        formattedValue = new Date(value).toLocaleDateString()
        return formattedValue
      case 'datetime':
        formattedValue = new Date(value).toLocaleString()
        return formattedValue
      default:
        return value
    }
  } catch(e:any) {
    logger(`formatValue error: ${e.message}`, 'warn')
    return value
  }
}

function TableRow<T extends {id:string,origin?:string}, K extends keyof T>({data, cols}: {data: T, cols: Column<T,K>[]}) {
  return (
    <MuiTableRow data-testid="mui-table-body-row">
      {
        cols.map((col) => {
          const key = `column-${col.key.toString()}`
          const value = formatValue(col, data[col.key])
          if (col?.patchFn) {
            return (
              <MuiTableCell
                key={key}
                className={col.className}
                sx={col?.sx}
              >
                <EditableCell
                  params={{
                    id: data.id,
                    key: col.key.toString(),
                    value,
                    origin: data?.origin,
                    type: col.type
                  }}
                  patchFn={col?.patchFn}
                  disabledFn={col?.disabledFn}
                />
              </MuiTableCell>
            )
          }
          if (col?.renderFn) {
            return (
              <MuiTableCell
                key={key}
                className={col.className}
                sx={col?.sx}
              >
                {/* custom render function */}
                {col.renderFn(data)}
              </MuiTableCell>
            )
          }
          return <MuiTableCell key={key} className={`p-2 ${col.className ?? ''}`}>{value}</MuiTableCell>
        })
      }
    </MuiTableRow>
  )
}

export default function TableBody<T extends {id:string,origin?:string}, K extends keyof T>({
  data, columns}: {data: T[], columns: Column<T, K>[]}) {
  return (
    <MuiTableBody>
      {data.map((item,i) => {
        return <TableRow key={`row-${i}`} cols={columns} data={item} />
      })}
    </MuiTableBody>
  )
}
