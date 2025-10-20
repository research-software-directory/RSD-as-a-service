// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {useSession} from '~/auth/AuthProvider'
import EditableTable, {OrderByProps} from '~/components/table/EditableTable'
import useContributors, {RsdContributor} from './useContributors'
import ContentLoader from '~/components/layout/ContentLoader'

const styles = {
  flex: 1,
  overflow: 'auto',
  padding: '0.5rem 0rem',
  cursor: 'default'
}

// initial contributors order is on family names
const initialOrder:OrderByProps<RsdContributor, keyof RsdContributor> = {
  column: 'family_names',
  direction: 'asc'
}

export default function ContributorsTable() {
  const {token} = useSession()
  const [orderBy, setOrderBy] = useState<OrderByProps<RsdContributor, keyof RsdContributor>>(initialOrder)
  const {loading, columns, contributors} = useContributors({token,orderBy})

  // console.group('ContributorsTable')
  // console.log('loading...', loading)
  // console.log('columns...', columns)
  // console.log('contributors...', contributors)
  // console.groupEnd()

  if(loading) return <ContentLoader/>

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
      <div className="py-4 text-sm">
        * Avatars are aggregated by combination of Given names and Family names or ORCID.
        If there is more than one avatar option you can click on the avatar to change it.
        <div className="text-sm">
          * Unused avatar images are not removed from RSD database.
        </div>
      </div>
    </div>
  )
}
