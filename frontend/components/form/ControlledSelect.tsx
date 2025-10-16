// SPDX-FileCopyrightText: 2022 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {Controller} from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'

export type Option = {
  label: string,
  value: string
}

export type ControlledSelectProps = {
  name: string
  label: string
  options: Option[]
  disabled: boolean
  defaultValue: any
  control: any
  rules: any
  helperTextMessage:string
  sx?: any
  variant?: 'standard'|'outlined'|'filled'
}

export default function ControlledSelect({name, label, options, control,
  rules, defaultValue, disabled, sx, helperTextMessage, variant}: ControlledSelectProps) {
  // do not render if no options provided
  if (!options || options?.length === 0) return null

  return (
    <Controller
      name={name}
      defaultValue={defaultValue ?? null}
      rules={rules}
      control={control}
      render={({field}) => {
        const {onChange, value} = field
        return (
          <FormControl
            data-testid="controlled-select"
            variant={variant ?? 'outlined'}
            sx={sx}
          >
            <InputLabel
              aria-label={label}
              id={`select-${label}`}>
              {label}
            </InputLabel>
            <Select
              id={`select-${label}`}
              label={label}
              variant='outlined'
              value={value ?? ''}
              onChange={({target}:{target:any}) => {
                onChange(target.value)
              }}
              disabled={disabled}
            >
              {options.map(item => {
                return (
                  <MenuItem
                    data-testid="controlled-select-item"
                    key={item.value}
                    value={item.value}>
                    {item.label}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{helperTextMessage ?? ''}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
