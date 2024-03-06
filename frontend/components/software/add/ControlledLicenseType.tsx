// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Controller} from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

type Option = {
  label: string,
  value: string
}

export type ControlledLicenseTypeProps = {
  name: string
  options: Option[]
  control: any
  rules: any
  defaultValue: any
}

export default function ControlledLicenseType({name, options, control,
  rules, defaultValue}: ControlledLicenseTypeProps) {
  // do not render if no options provided
  if (!options || options?.length === 0) return null

  return (
    <Controller
      name={name}
      defaultValue={defaultValue ?? null}
      rules={rules}
      control={control}
      render={({field}) => {
        // const {value} = field
        return (
          <FormControl>
            {/* <FormLabel id="license-type-radio-group">{config.open_source.label}</FormLabel> */}
            <RadioGroup
              row
              aria-labelledby="license-type-radio-group"
              {...field}
            >
              {
                options.map(option=>{
                  return (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  )
                })
              }
            </RadioGroup>
            {/* <FormHelperText>{config.open_source.help}</FormHelperText> */}
          </FormControl>
        )
      }}
    />
  )
}
