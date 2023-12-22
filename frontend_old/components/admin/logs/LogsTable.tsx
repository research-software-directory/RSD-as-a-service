// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import EditableTable, {Column, OrderByProps} from '~/components/table/EditableTable'
import ContentLoader from '~/components/layout/ContentLoader'
import {BackendLog} from './useLogs'

type LogTableProps={
  loading: boolean
  columns: Column<BackendLog, keyof BackendLog>[],
  logs: BackendLog[],
  orderBy: OrderByProps<BackendLog, keyof BackendLog>
  setOrderBy: (orderBy:OrderByProps<BackendLog, keyof BackendLog>)=>void
}

export default function LogsTable({loading,columns,logs,orderBy,setOrderBy}:LogTableProps) {
  // const [orderBy, setOrderBy] = useState<OrderByProps<BackendLog, keyof BackendLog>>(initalOrder)
  // const {loading, columns, logs} = useLogs({orderBy})

  // console.group('LogsTable')
  // console.log('loading...', loading)
  // console.log('columns...', columns)
  // console.log('logs...', logs)
  // console.groupEnd()

  const styles = {
    flex: 1,
    overflow: 'auto',
    padding: '0.5rem 0rem',
    cursor: 'default',
    minHeight: logs.length > 7 ?'80vh':'50vh'
  }

  if (logs.length === 0 && loading===false) {
    return (
      <section className="flex-1">
        <Alert severity="info"
          sx={{
            marginTop: '0.5rem'
          }}
        >
          <AlertTitle sx={{fontWeight:500}}>No error logs. Nice job!</AlertTitle>
        </Alert>
      </section>
    )
  }

  function onSortColumn(column:keyof BackendLog) {
    if (orderBy && orderBy.column === column) {
      if (orderBy.direction === 'asc') {
        setOrderBy({
          column,
          direction: 'desc'
        })
      } else {
        setOrderBy({
          column,
          direction: 'asc'
        })
      }
    } else {
      setOrderBy({
        column,
        direction: 'asc'
      })
    }
  }

  return (
    <div style={styles} className={`${loading ? 'cursor-wait' : 'cursor-default'}`}>
      {
        loading ?
          <ContentLoader/>
          :
          <EditableTable
            className='w-full mb-8 text-sm'
            columns={columns}
            data={logs}
            onSort={onSortColumn}
          />
      }
    </div>
  )
}
