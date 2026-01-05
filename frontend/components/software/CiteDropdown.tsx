// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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

  return (
    <FormControl fullWidth>
      <InputLabel id={`cite-dropdown-${label}`}>{label}</InputLabel>
      <Select
        data-testid="cite-dropdown"
        labelId={`cite-dropdown-${label}`}
        // id="cite-dropdown-select"
        value={value}
        label={label}
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
