// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Column} from '~/components/table/EditableTable'
import {BackendLog} from './useLogs'
import ErrorInfoCell from './ErrorInfoCell'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

export function createColumns(onDelete:(id:string)=>Promise<void>) {
  const columns: Column<BackendLog, keyof BackendLog>[] = [{
    key: 'created_at',
    label: 'Created at',
    type: 'datetime',
    sx: {
      padding: '0.5rem',
      width: '7rem',
    },
  }, {
    key: 'service_name',
    label: 'Service',
    type: 'string',
  }, {
    key: 'table_name',
    label: 'Table',
    type: 'string'
  }, {
    key: 'message',
    label: 'Error info',
    type: 'custom',
    sx: {
      // needs scrollers
      overflow: 'auto'
    },
    renderFn: (data) => {
      return (
        <ErrorInfoCell
          message={data.message}
          stack_trace={data.stack_trace}
          other_data={data.other_data}
          id={data.id}
          slug={data.slug}
        />
      )
    }
  }, {
    key: 'delete',
    label: 'Action',
    type: 'custom',
    renderFn: (data) => {
      return (
        <IconButton
          title="Delete"
          edge="end"
          size="medium"
          aria-label="delete"
          onClick={() => {
            onDelete(data.id)
          }}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  }]

  return columns
}

