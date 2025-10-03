// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRef, useState} from 'react'
import Link from 'next/link'

import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import {ProjectQualityKeys, ProjectQualityProps} from './apiProjectQuality'

export type SortableTableProperties = {
  label: string,
  type: 'text' | 'boolean' | 'number' | 'link' | 'pct',
  sx?: any
}

type SortableTableProps = {
  metadata: Map<string, SortableTableProperties>,
  initialData: any[],
  initialOrder: string
}

export default function SortableTable({metadata, initialData, initialOrder=''}: SortableTableProps) {
  const propKeys = Array.from(metadata.keys())
  const [sortColumn, setSortColumn] = useState(initialOrder)
  const [data] = useState(initialData)
  const [ascending, setAscending] = useState(true)
  const tableRef = useRef<any>(null)

  function getDirection(metadataKey:string){
    if (metadataKey === sortColumn) {
      return ascending ? 'asc' : 'desc'
    }
    return 'asc'
  }

  function renderCell(item: ProjectQualityProps, metadataKey: ProjectQualityKeys) {
    const metaData = metadata.get(metadataKey)
    if (typeof metaData === 'undefined') return item[metadataKey]

    switch (metaData.type) {
      case 'boolean':
        if (item[metadataKey] === true) return <CheckIcon sx={{color:'success.main'}} />
        else if (item[metadataKey] === false) return <CloseIcon sx={{color:'error.main'}} />
        else return <QuestionMarkIcon sx={{color: 'info.main'}} />
      case 'text': return item[metadataKey] === null ? <CloseIcon sx={{color:'error.main'}} /> : item[metadataKey]
      case 'pct':
        const value = item[metadataKey]
        return `${Math.round(value as number)}%`
      case 'number': return item[metadataKey] as number > 0 ? item[metadataKey] : <CloseIcon sx={{color:'error.main'}} />
      case 'link':
        const href = `/projects/${item['slug']}/edit`
        return <Link href={href} target="_blank">{item[metadataKey]}</Link>
    }
  }

  function sortByLabel(label: string) {
    const properties = metadata.get(label)
    if (properties === undefined) throw new Error(properties)

    let nowAscending: boolean
    if (label != sortColumn) nowAscending = true
    else nowAscending = !ascending

    const type = properties.type
    // update sort in existing data object
    if (type === 'boolean' || type === 'number' || type === 'pct') {
      data.sort((a, b) => nowAscending ? a[label] - b[label] : b[label] - a[label])
    } else {
      data.sort((a, b) => compareStringNullsAware(a[label], b[label], nowAscending))
    }
    setAscending(nowAscending)
    setSortColumn(label)
  }

  function compareStringNullsAware(s1: string | null, s2: string | null, ascending: boolean): number {
    if (s1 === null && s2 === null) return 0

    if (s1 === null && s2 !== null) return ascending ? -1 : 1
    if (s1 !== null && s2 === null) return !ascending ? -1 : 1

    return ascending ? s1!.localeCompare(s2!) : s2!.localeCompare(s1!)
  }

  return (
    <Table stickyHeader ref={tableRef}>
      <TableHead>
        <TableRow>
          {propKeys.map((metadataKey) => {
            return (
              <TableCell
                key={metadataKey}
                onClick={() => sortByLabel(metadataKey)}
                sx={{
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  ...metadata.get(metadataKey)?.sx
                }}
              >
                <TableSortLabel
                  active={sortColumn===metadataKey}
                  direction={getDirection(metadataKey)}
                  onClick={() => sortByLabel(metadataKey)}
                >
                  {metadata.get(metadataKey)?.label}
                </TableSortLabel>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, pos) => {
          return (
            <TableRow key={pos}>
              {propKeys.map((metadataKey) => {
                return (
                  <TableCell
                    key={metadataKey}
                    sx={{
                      padding: '0.25rem 0.5rem',
                    }}
                  >
                    {renderCell(item,metadataKey as ProjectQualityKeys)}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
