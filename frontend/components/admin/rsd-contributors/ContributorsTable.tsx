// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {useSession} from '~/auth'
import {RsdContributor, useContributors} from './apiContributors'
import EditableTable, {OrderByProps} from '~/components/table/EditableTable'

const styles = {
  flex: 1,
  overflow: 'auto',
  padding: '0.5rem 0rem',
  cursor: 'default'
}

// inital contributors order is on family names
const initalOrder:OrderByProps<RsdContributor, keyof RsdContributor> = {
  column: 'family_names',
  direction: 'asc'
}

export default function ContributorsTable() {
  const {token} = useSession()
  const [orderBy, setOrderBy] = useState<OrderByProps<RsdContributor, keyof RsdContributor>>(initalOrder)
  const {loading, columns, contributors} = useContributors({token,orderBy})

  if (contributors.length === 0) {
    return (
      <section className="flex-1">
        <Alert severity="warning"
          sx={{
            marginTop: '0.5rem'
          }}
        >
          <AlertTitle sx={{fontWeight:500}}>Contributor not found</AlertTitle>
        </Alert>
      </section>
    )
  }

  function onSortColumn(column:keyof RsdContributor) {
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
        columns={columns}
        data={contributors}
        onSort={onSortColumn}
      />
    </div>
  )
}
