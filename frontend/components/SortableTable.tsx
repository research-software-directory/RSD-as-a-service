// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import {useState} from 'react'
import Link from 'next/link'

export type SortableTableProperties = {
  label: string,
  type: 'text' | 'boolean' | 'number' | 'link',
}

export default function SortableTable({metadata, initialData}: {metadata: Map<string, SortableTableProperties>, initialData: any[]}) {
  const propKeys = Array.from(metadata.keys())
  const [sortColumn, setSortColumn] = useState('')
  const [data, setData] = useState(initialData)
  const [ascending, setAscending] = useState(true)

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {propKeys.map((metadataKey) => <TableCell onClick={() => sortByLabel(metadataKey)} key={metadataKey}>{`${sortSymbol(metadataKey)} ${metadata.get(metadataKey)?.label}`}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => tableRowFromDataEntry(item))}
        </TableBody>
      </Table>
    </>
  )

  function tableRowFromDataEntry(entry: any) {
    return (
      <TableRow>
        {propKeys.map((metadataKey) => <TableCell key={metadataKey}>{renderItem(metadata.get(metadataKey), entry[metadataKey])}</TableCell>)}
      </TableRow>
    )
  }

  function renderItem(metaData: any, item: any) {
    switch (metaData.type) {
      case 'boolean':
        if (item === true) return '✅'
        else if (item === false) return '❌'
        else return '❓'
      case 'text': return item
      case 'number': return item
      case 'link': return <Link href={item.slug}>{item.text}</Link>
    }
  }

  function sortSymbol(label: string) {
    const properties = metadata.get(label)
    if (properties === undefined) throw new Error(properties)
    if (properties.type == 'link') return ''

    if (sortColumn !== label) return '↕️'
    else return ascending ? '⬆️' : '⬇️'
  }

  function sortByLabel(label: string) {
    const properties = metadata.get(label)
    if (properties === undefined) throw new Error(properties)

    const type = properties.type
    if (type === 'link') return
    let nowAscending: boolean
    if (label != sortColumn) nowAscending = true
    else nowAscending = !ascending

    if (type === 'boolean' || type === 'number') {
      data.sort((a, b) => nowAscending ? a[label] - b[label] : b[label] - a[label])
    } else if (type === 'text') {
      data.sort((a, b) => nowAscending ? a[label].localeCompare(b[label]) : b[label].localeCompare(a[label]))
    } else return
    setAscending(nowAscending)
    setSortColumn(label)
    setData(data)
  }
}
