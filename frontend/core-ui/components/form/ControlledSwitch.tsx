// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Controller} from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

type ControlledSwitchProps = {
  label: string,
  name: string,
  control: any,
  defaultValue?: boolean
  disabled?: boolean
  onSave?:(value:boolean)=>void
}


export default function ControlledSwitch({label, name,
  defaultValue = false, control, disabled = false, onSave}: ControlledSwitchProps) {
  // console.log('ControlledSwitch.defaultValue...', defaultValue)
  return (
    <Controller
      name={name}
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
