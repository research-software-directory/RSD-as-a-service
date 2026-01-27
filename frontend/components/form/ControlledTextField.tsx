// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useRef, JSX} from 'react'
import {Controller} from 'react-hook-form'
import TextField, {TextFieldProps} from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import HelperTextWithCounter from './HelperTextWithCounter'

export type ControlledTextFieldOptions<T> = {
  name: keyof T,
  autofocus?:boolean
  autoComplete?: string
  multiline?: boolean
  minRows?: number
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
  startAdornment?: string | JSX.Element
  endAdornment?: string | JSX.Element
  muiProps?: TextFieldProps
}

export type ControlledTextFieldProps<T> = {
  options: ControlledTextFieldOptions<T>,
  control: any,
  rules?: any
}

export default function ControlledTextField<T>({options, control, rules}:ControlledTextFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (options.autofocus === true && inputRef.current) {
      inputRef.current?.focus()
    }
  }, [options.autofocus])


  if (options?.useNull && options?.defaultValue==='') options.defaultValue=null

  return (
    <Controller
      name={options.name.toString()}
      defaultValue={options?.defaultValue}
      rules={rules}
      control={control}
      render={({field,fieldState}) => {
        const {onChange,value} = field
        const {error} = fieldState

        return (
          <TextField
            // eslint-disable-next-line react-hooks/purity
            id={options.name.toString() ?? `input-${Math.floor(Math.random()*10000)}`}
            inputRef={inputRef}
            disabled={options?.disabled ?? false}
            autoComplete={options?.autoComplete ?? 'off'}
            multiline={options?.multiline ?? false}
            minRows={options?.minRows ?? undefined}
            maxRows={options?.maxRows ?? undefined}
            rows={options?.rows ?? undefined}
            error={error ? true : false}
            label={options?.label ?? 'Label not provided'}
            type={options?.type ?? 'text'}
            fullWidth={options?.fullWidth ?? true }
            variant={options?.variant ?? 'outlined'}
            // controlled mui input requires "" instead of null
            // but the value in controller of react-hook-form is null (can be null)
            value={value ?? ''}
            slotProps={{
              input:{
                startAdornment: options?.startAdornment ? <InputAdornment position="start">{options?.startAdornment}</InputAdornment> : undefined,
                endAdornment: options?.endAdornment ? <InputAdornment position="end">{options?.endAdornment}</InputAdornment> : undefined
              },
              formHelperText:{
                sx:{
                  display: 'flex',
                  justifyContent:'space-between'
                }
              },
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
