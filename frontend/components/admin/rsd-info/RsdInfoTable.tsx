// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {useSession} from '~/auth'
import EditableTable, {OrderByProps} from '~/components/table/EditableTable'
import ContentLoader from '~/components/layout/ContentLoader'
import {RsdInfo} from './apiRsdInfo'
import useRsdInfo from './useRsdInfo'

const styles = {
  flex: 1,
  overflow: 'auto',
  padding: '0.5rem 0rem',
  cursor: 'default'
}

// initial order is on key
const initialOrder:OrderByProps<RsdInfo, keyof RsdInfo> = {
  column: 'key',
  direction: 'asc'
}

export default function RsdInfoTable() {
  const {token} = useSession()
  const [orderBy, setOrderBy] = useState<OrderByProps<RsdInfo, keyof RsdInfo>>(initialOrder)
  const {loading, columns, rsdInfo} = useRsdInfo({token,orderBy})

  // console.group('RsdInfoTable')
  // console.log('loading...', loading)
  // console.log('columns...', columns)
  // console.log('rsdInfo...', rsdInfo)
  // console.groupEnd()

  if(loading) return <ContentLoader/>

  if (rsdInfo.length === 0) {
    return (
      <section className="flex-1">
        <Alert severity="warning"
          sx={{
            marginTop: '0.5rem'
          }}
        >
          <AlertTitle sx={{fontWeight:500}}>Rsd info not found</AlertTitle>
        </Alert>
      </section>
    )
  }

  function onSortColumn(column:keyof RsdInfo) {
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
      <EditableTable
        className='w-full mb-8 text-sm'
        // NOTE! improve columns type
        columns={columns as any}
        data={rsdInfo}
        onSort={onSortColumn}
      />
      <div className="py-4 text-sm">
        * Click on the value to update the value
      </div>
    </div>
  )
}
