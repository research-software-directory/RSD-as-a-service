// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Switch from '@mui/material/Switch'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {ColType} from './EditableTable'

export type UpdateProps = {
  id: string,
  key: string,
  value: any
  type: ColType
  origin?: string
}

type EditableCellProps = Readonly<{
  params: UpdateProps,
  patchFn?: (props:UpdateProps)=>Promise<{status:number,message:string}>
  validFn?: (props:UpdateProps)=>boolean
  disabledFn?: (props:UpdateProps)=>boolean
}>

export default function EditableCell({params,patchFn,disabledFn}: EditableCellProps) {
  const {showErrorMessage} = useSnackbar()
  const {value} = params
  const [localValue, setValue] = useState(value)

  // console.group('EditableCell')
  // console.log('params...', params)
  // console.log('localValue...', localValue)
  // console.log('value...', value)
  // console.groupEnd()

  useEffect(() => {
    setValue(value)
  },[value])

  async function patchValue(newValue:any) {
    if (patchFn) {
      const resp = await patchFn({
        ...params,
        value: newValue
      })
      if (resp.status !== 200) {
        // show error message
        showErrorMessage(`Failed to update value. ${resp.message}`)
        // reverse back to original value
        setValue(value)
      }
    }
  }

  if (params.type==='boolean'){
    return (
      <Switch
        disabled={disabledFn ? disabledFn(params) : false}
        data-testid="edit-cell-switch"
        checked={localValue}
        onChange={({target}) => {
          setValue(target.checked)
          patchValue(target.checked)
        }}
      />
    )
  }

  return (
    <input
      disabled={disabledFn ? disabledFn(params) : false}
      className="p-1 w-full focus:bg-base-200"
      type="text"
      value={localValue}
      onChange={({target})=>{
        setValue(target.value)
      }}
      onBlur={({target})=>patchValue(target.value)}
    />
  )
}
