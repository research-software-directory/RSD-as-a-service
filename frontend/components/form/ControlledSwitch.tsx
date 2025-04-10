// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'
import {Controller} from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export type ControlledSwitchProps<T> = Readonly<{
  name: keyof T,
  label: ReactNode | string,
  control: any,
  defaultValue?: boolean
  disabled?: boolean
  onSave?:(value:boolean)=>void
}>


export default function ControlledSwitch<T>({label, name,
  defaultValue = false, control, disabled = false, onSave}: ControlledSwitchProps<T>) {
  // console.log('ControlledSwitch.defaultValue...', defaultValue)
  return (
    <Controller
      name={name.toString()}
      defaultValue={defaultValue}
      control={control}
      render={({field}) => {
        const {onChange, value} = field
        // console.log('ControlledSwitch.value...', value)
        return (
          <FormControlLabel
            data-testid="controlled-switch-label"
            control={
              <Switch
                data-testid="controlled-switch"
                checked={value}
                onChange={({target}) => {
                  onChange(target.checked)
                  if(onSave) onSave(target.checked)
                }}
                disabled={disabled ?? false}
              />
            }
            label={label}
          />
        )
      }}
    />
  )
}
