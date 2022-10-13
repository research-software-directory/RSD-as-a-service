// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef} from 'react'
import {Controller} from 'react-hook-form'
import TextField, {TextFieldProps} from '@mui/material/TextField'
import HelperTextWithCounter from './HelperTextWithCounter'

export type ControlledTextFieldOptions = {
  name: string,
  autofocus?:boolean
  autoComplete?: string
  multiline?: boolean
  maxRows?: number
  rows?: number
  label: string
  type?: string
  fullWidth?: boolean
  variant?: 'outlined'|'standard'
  useNull?: boolean,
  defaultValue?: string | number | null
  helperTextMessage?: string | JSX.Element
  helperTextCnt?: string
  disabled?: boolean
  muiProps?: TextFieldProps
}

export type ControlledTextFieldProps = {
  options: ControlledTextFieldOptions,
  control: any,
  rules?: any
}

export default function ControlledTextField({options, control, rules}:ControlledTextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (options.autofocus === true && inputRef.current) {
      inputRef.current?.focus()
    }
  }, [options.autofocus])

  if (options?.useNull && options?.defaultValue==='') options.defaultValue=null

  return (
    <Controller
      name={options.name}
      defaultValue={options?.defaultValue}
      rules={rules}
      control={control}
      render={({field,fieldState}) => {
        const {onChange,value} = field
        const {error} = fieldState
          // console.group(`ControlledTextField...${options.name}`)
          // console.log('error...',error)
          // console.log('value...', value)
          // console.groupEnd()
        return (
          <TextField
            id={options.name ?? `input-${Math.floor(Math.random()*10000)}`}
            inputRef={inputRef}
            disabled={options?.disabled ?? false}
            autoComplete={options?.autoComplete ?? 'off'}
            multiline={options?.multiline ?? false}
            maxRows={options?.maxRows ?? undefined}
            rows={options?.rows ?? undefined}
            error={error ? true: false}
            label={options?.label ?? 'Label not provided'}
            type={options?.type ?? 'text'}
            fullWidth={options?.fullWidth ?? true }
            variant={options?.variant ?? 'standard'}
            // controlled mui input requires "" instead of null
            // but the value in controller of react-hook-form is null (can be null)
            value={value ?? ''}
            FormHelperTextProps={{
              sx:{
                display: 'flex',
                justifyContent:'space-between'
              }
            }}
            helperText={
              <HelperTextWithCounter
                // message={options?.helperTextMessage ?? ''}
                message={error?.message ?? options?.helperTextMessage ?? ''}
                count={options?.helperTextCnt ?? ''}
              />
            }
            onChange={({target}) => {
              // use null instead of empty string
              if (target.value === '' && options?.useNull) {
                onChange(null)
              } else {
                onChange(target.value)
              }
            }}
            {...options.muiProps}
          />
        )
      }}
    />
  )
}
