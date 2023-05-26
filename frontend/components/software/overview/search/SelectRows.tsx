// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {setDocumentCookie} from '../userSettings'
import {rowsPerPageOptions} from '~/config/pagination'

type SelectRowsProps = {
  rows: number
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function SelectRows({rows,handleQueryChange}:SelectRowsProps) {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth: '4rem',
        backgroundColor: 'background.paper',
        paddingLeft: '0.5rem',
        '.MuiOutlinedInput-notchedOutline': {
          border: 0
        }
      }}
      title={`Show ${rows} items on page`}
    >
      <Select
        id="select-rows"
        labelId="select-rows-label"
        variant="outlined"
        value={rows ?? 12}
        // label="Items"
        onChange={({target}) =>{
          // console.log('rows...', target.value)
          handleQueryChange('rows', target.value.toString())
          // save to cookie
          setDocumentCookie(target.value.toString(),'rsd_page_rows')
        }}
        sx={{
          border: '1px solid #fff'
        }}
      >
        {/* load page options from config */}
        {rowsPerPageOptions.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>) }
      </Select>
    </FormControl>
  )
}
