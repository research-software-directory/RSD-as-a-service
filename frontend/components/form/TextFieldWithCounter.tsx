// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef, JSX} from 'react'
import TextField from '@mui/material/TextField'
import HelperTextWithCounter from './HelperTextWithCounter'
import InputAdornment from '@mui/material/InputAdornment'

type TextFieldWidthCounterType = {
  autofocus?:boolean
  autoComplete?: string
  multiline?: boolean
  rows?: number,
  maxRows?: number
  error?: boolean
  label: string
  type?: string
  fullWidth?: boolean
  variant?: string
  defaultValue?:string
  helperTextMessage?: string
  helperTextCnt?: string
  disabled?: boolean
  startAdornment?: string | JSX.Element
  endAdornment?: string | JSX.Element
}

export default function TextFieldWithCounter({options, register}:
{options: TextFieldWidthCounterType, register: any}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (options.autofocus === true && inputRef.current) {
      inputRef.current?.focus()
    }
  },[options.autofocus])

  return (
    <TextField
      inputRef={inputRef}
      disabled={options?.disabled ?? false}
      autoComplete={options?.autoComplete ?? 'off'}
      multiline={options?.multiline ?? false}
      rows={options?.rows ?? undefined}
      maxRows={options?.maxRows ?? undefined}
      error={options?.error ?? false}
      // eslint-disable-next-line react-hooks/purity
      id={options?.label ?? `input-${Math.floor(Math.random()*10000)}`}
      label={options?.label ?? 'Label not provided'}
      type={options?.type ?? 'text'}
      fullWidth={options?.fullWidth ?? true }
      variant={options?.variant ?? 'standard'}
      defaultValue={options?.defaultValue ?? null}
      slotProps={{
        input:{
          startAdornment: options?.startAdornment ?
            <InputAdornment position="start">{options?.startAdornment}</InputAdornment>
            : undefined,
          endAdornment: options?.endAdornment ?
            <InputAdornment position="end">{options?.endAdornment}</InputAdornment>
            : undefined
        },
        formHelperText:{
          sx:{
            display: 'flex',
            justifyContent:'space-between'
          }
        }
      }}
      helperText={
        <HelperTextWithCounter
          message={options?.helperTextMessage ?? ''}
          count={options?.helperTextCnt ?? ''}
        />
      }
      {...register}
    />
  )
}
