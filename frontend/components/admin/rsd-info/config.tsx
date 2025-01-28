// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {Column} from '~/components/table/EditableTable'
import {patchRsdInfo, RsdInfo, RsdInfoTable} from './apiRsdInfo'
import AddRsdInfo from './AddRsdInfo'

export function createColumns(token: string, addRsdInfo:(data:RsdInfo)=>void, deleteRsdInfo:(key:string)=>void) {
  const columns: Column<RsdInfoTable, keyof RsdInfoTable>[] = [{
    key: 'key',
    label: 'Key',
    type: 'string',
  }, {
    key: 'value',
    label: 'Value*',
    type: 'string',
    patchFn: async (props) => {
      // change "" to null
      if (props.value===''){
        props.value = null
      }
      return patchRsdInfo({
        ...props,
        token
      })
    },
  }, {
    key: 'public',
    label: 'Public',
    type: 'boolean',
    patchFn: async (props) => patchRsdInfo({
      ...props,
      token
    })
  },{
    key: 'created_at',
    label: 'Created At',
    type: 'datetime',
  },{
    key: 'updated_at',
    label: 'Updated At',
    type: 'datetime',
  },{
    key: 'command',
    label: 'Add',
    // use command type to render column header button using headerFn
    type: 'custom',
    // render "Add" button in the column header and add modal
    headerFn: ()=>{
      return (
        <AddRsdInfo onAdd={addRsdInfo} />
      )
    },
    // render "Delete" button on each row
    renderFn: ({key}) => {
      return (
        <IconButton
          // rsd remote name should not be deleted
          // disabled={key==='remote_name'}
          title={`Delete ${key}`}
          aria-label='delete'
          onClick={()=>{
            deleteRsdInfo(key)
          }}
        >
          <DeleteIcon />
        </IconButton>
      )
    },
  }]

  return columns
}


export const rsdInfoForm = {
  modalTitle: 'Add rsd info',
  key:{
    label: 'Key*',
    help: 'Unique single word without spaces is required.',
    validation: {
      required: 'Unique key value is required.',
      minLength: {value: 3, message: 'Minimum length is 3'},
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 100, message: 'Maximum length is 100'},
      pattern: {
        // only chars, numbers and _, also exclude from sonar analyses
        value: /^[a-z0-9A-Z\_]+([a-z0-9A-Z]+)*$/, // NOSONAR
        message: 'Use only letters, numbers and underscore "_".'
      }
    }
  },
  value:{
    label: 'Value*',
    help: 'The string value assigned to the key property is required.',
    validation: {
      required: 'Value is required',
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 250, message: 'Maximum length is 250'}
    }
  },
  public:{
    label: 'Public',
    help: 'Is this info available to everyone accessing the rsd_info endpoint?',
    validation: {
      required: 'Active flag is required.',
    }
  }
}
