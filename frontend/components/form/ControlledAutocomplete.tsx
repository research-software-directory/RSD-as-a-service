// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {Controller} from 'react-hook-form'

type ControlledAutocompleteProps = {
  name: string,
  label: string,
  options: string[],
  helperTextMessage?: string | JSX.Element,
  control: any
  rules: any
  variant?: 'standard' | 'outlined' | 'filled'
}

export default function ControlledAutocomplete({
  name, label, control, rules, options, variant, helperTextMessage
}: ControlledAutocompleteProps) {

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({field,fieldState}) => {
        const {onChange,value} = field
        const {error} = fieldState
        // console.group(`ControlledAutocomplete...${name}`)
        // console.log('error...',error)
        // console.log('value...', value)
        // console.groupEnd()
        return (
          <Autocomplete
            freeSolo={true}
            multiple={false}
            options={options}
            value={value}
            onInputChange={(e, newVal) => {
              // Save typed input into the controller (form data)
              // Note! onChange triggers the dirty state
              // we do not want to call it when data is not changed
              if (newVal !== value){
                // debugger
                if (newVal === '') {
                  onChange(null)
                }else{
                  onChange(newVal)
                }
              }
            }}
            onChange={(e, item) => {
              // debugger
              onChange(item)
            }}
            popupIcon={<KeyboardArrowDownIcon />}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={label}
                  variant={variant ?? 'outlined'}
                  error={error ? true: false}
                  helperText={error?.message ?? helperTextMessage ?? ''}
                />
              )
            }}
          />
        )
      }}
    />
  )
}
