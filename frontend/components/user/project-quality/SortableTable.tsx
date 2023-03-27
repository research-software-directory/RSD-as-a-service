// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
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
  const [data, setData] = useState(initialData)
  const [ascending, setAscending] = useState(true)

  function getDirection(metadataKey:string){
    if (metadataKey === sortColumn) {
      return ascending ? 'asc' : 'desc'
    }
    return 'asc'
  }

  return (
    <Table stickyHeader >
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

  function renderCell(item: ProjectQualityProps, metadataKey: ProjectQualityKeys) {
    const metaData = metadata.get(metadataKey)
    if (typeof metaData === 'undefined') return item[metadataKey]

    switch (metaData.type) {
      case 'boolean':
        if (item[metadataKey] === true) return <CheckIcon sx={{color:'success.main'}} />
        else if (item[metadataKey] === false) return <CloseIcon sx={{color:'error.main'}} />
        else return <QuestionMarkIcon sx={{color: 'info.main'}} />
      case 'text': return item[metadataKey]
      case 'pct':
        const value = item[metadataKey]
        return `${Math.round(value as number)}%`
      case 'number': return item[metadataKey]
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
    // if (type === 'link') {
    //   // data.sort((a, b) => nowAscending ? a[label]['text'].localeCompare(b[label]['text']) : b[label]['text'].localeCompare(a[label]['text']))
    // } else
    if (type === 'boolean' || type === 'number' || type === 'pct') {
      data.sort((a, b) => nowAscending ? a[label] - b[label] : b[label] - a[label])
    } else {
      data.sort((a, b) => nowAscending ? a[label].localeCompare(b[label]) : b[label].localeCompare(a[label]))
    }
    setAscending(nowAscending)
    setSortColumn(label)
    setData(data)
  }
}
