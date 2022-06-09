// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useRef} from 'react'
import {Controller} from 'react-hook-form'
import TextField, {TextFieldProps} from '@mui/material/TextField'

export type ControlledTextInputProps = {
  name: string,
  defaultValue: string | null
  rules?: any
  control: any
  muiProps?: TextFieldProps
  autofocus?: boolean
  useNull?: boolean
}

export default function ControlledTextInput({
  name, defaultValue, control, rules, muiProps,autofocus, useNull}: ControlledTextInputProps
) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (autofocus === true && inputRef.current) {
      inputRef.current?.focus()
    }
  }, [autofocus])

  if (useNull && defaultValue==='') defaultValue=null

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      control={control}
      render={({field,fieldState}) => {
        const {onChange} = field
        // const {error} = fieldState
        return (
          <TextField
            id={name ?? `input-${Math.floor(Math.random()*10000)}`}
            inputRef={inputRef}
            defaultValue={defaultValue}
            onChange={({target}) => {
              // use null instead of empty string
              if (target.value === '' && useNull) {
                onChange(null)
              } else {
                onChange(target.value)
              }
            }}
            {...muiProps}
          />
        )
      }}
    />
  )
}
