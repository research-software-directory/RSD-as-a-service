// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useId} from 'react'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

export type SelectOption={
  label:string,
  value:string,
  disabled?:boolean
}

export default function CiteDropdown({label,options=[],value,onChange}:
{label:string,options:SelectOption[],value:string,onChange:any}) {
  // Generates a unique, valid HTML ID safe from spaces or special characters
  const uniqueId = useId()
  // ensure valid unique id's created to link label for a11y
  const labelId = `cite-label-${uniqueId}`
  const selectId = `cite-select-${uniqueId}`

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        data-testid="cite-dropdown"
        id={selectId}
        // pass label id to use for a11y
        labelId={labelId}
        value={value}
        label={label}
        inputProps={{
          // Fallback visual anchor for testing tools
          'aria-label': label,
        }}
        onChange={onChange}
        sx={{
          minWidth:'14rem',
          flex:1
        }}
      >
        {
          options.map(item=>{
            return (
              <MenuItem
                disabled={item?.disabled ?? false}
                key={item.label}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            )
          })
        }
      </Select>
    </FormControl>
  )
}
