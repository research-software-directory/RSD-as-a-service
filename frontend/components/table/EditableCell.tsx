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
  const [localValue, setLocalValue] = useState(value)
  const [lastSaved, setLastSaved] = useState()

  // console.group('EditableCell')
  // console.log('params...', params)
  // console.log('value...', value)
  // console.log('lastSaved...', lastSaved)
  // console.log('localValue...', localValue)
  // console.groupEnd()

  useEffect(() => {
    setLocalValue(value)
  },[value])

  async function patchValue(newValue:any) {
    if (patchFn) {
      const resp = await patchFn({
        ...params,
        value: newValue
      })

      if (resp.status === 200){
        // save last value in local memory
        // for the recovery if next value fails
        setLastSaved(newValue)
      }else {
        // show error message
        showErrorMessage(`Failed to update value. ${resp.message}`)
        // reverse back to last saved value
        if (typeof lastSaved != 'undefined'){
          setLocalValue(lastSaved)
        } else if (value!==localValue) {
          // reverse to initial value
          setLocalValue(value)
        }
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
          setLocalValue(target.checked)
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
        setLocalValue(target.value)
      }}
      onBlur={({target})=>patchValue(target.value)}
    />
  )
}
