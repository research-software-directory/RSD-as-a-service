// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {Controller} from 'react-hook-form'

type ControlledAutocompleteProps = {
  name: string,
  label: string,
  options: string[],
  helperTextMessage: string,
  control: any
  rules: any
}

export default function ControlledAutocomplete({
  name, label, control, rules, options, helperTextMessage}: ControlledAutocompleteProps) {
  // const [open,setOpen]=useState(false)
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
            onInputChange={(e, value) => {
              // debugger
              if (value === '') onChange(null)
              onChange(value)
            }}
            onChange={(e, item, reason) => {
              // debugger
              onChange(item)
            }}
            popupIcon={<KeyboardArrowDownIcon />}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={label}
                  variant="standard"
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
