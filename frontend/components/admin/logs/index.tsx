// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import {Column, OrderByProps} from '~/components/table/EditableTable'
import LogsTable from './LogsTable'
import DeleteOldLogsBtn from './DeleteOldLogsBtn'
import useLogs, {BackendLog} from './useLogs'
import {createColumns} from './config'
import IconButton from '@mui/material/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'

// inital logs order is on family names
const initalOrder:OrderByProps<BackendLog, keyof BackendLog> = {
  column: 'created_at',
  direction: 'desc'
}

export default function ScraperErrorLogs() {
  const [orderBy, setOrderBy] = useState<OrderByProps<BackendLog, keyof BackendLog>>(initalOrder)
  const [columns, setColumns] = useState<Column<BackendLog, keyof BackendLog>[]>([])
  const {loading, logs, loadLogs, deleteLog, deleteOldLogs} = useLogs({orderBy})

  // update columns order
  if (orderBy) {
    columns.forEach(col => {
      if (col.key === orderBy.column) {
        col.order = {
          active: true,
          direction: orderBy.direction
        }
      } else {
        col.order = {
          active: false,
          direction: 'asc'
        }
      }
    })
  }

  useEffect(()=>{
    // here we pass deleteLog method to columns
    const cols = createColumns(deleteLog)
    setColumns(cols)
  },[deleteLog])

  return (
    <section className="flex-1 overflow-hidden">
      <div className="flex-1 flex py-8 md:py-0 flex-col xl:flex-row justify-start xl:items-center">
        <div className="flex-1 flex justify-start">
          <DeleteOldLogsBtn
            onDelete={()=>deleteOldLogs()}
            disabled={logs.length===0}
          />
          <Searchbox />
        </div>
        <div className="flex justify-end">
          <IconButton
            title="Reload"
            sx={{
              alignSelf:'center',
              marginLeft:[null,null,null,'1rem']
            }}
            onClick={loadLogs}
          >
            <RefreshIcon />
          </IconButton>
          <Pagination />
        </div>
      </div>
      <LogsTable
        loading={loading}
        columns={columns}
        logs={logs}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
    </section>
  )
}
