// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {rowsPerPageOptions} from '~/config/pagination'

type SelectRowsProps = Readonly<{
  items: number
  onItemsChange: (items:number)=>void
}>

export default function ShowItemsSelect({items, onItemsChange}: SelectRowsProps) {
  // console.group('ShowItemsSelect')
  // console.log('items...',items)
  // console.groupEnd()
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
      title={`Show ${items} items on page`}
    >
      <Select
        id="select-rows"
        variant="outlined"
        value={items}
        onChange={({target}) =>{
          // console.log('items...', target.value)
          onItemsChange(target.value)
        }}
        inputProps={{
          // a11y fix for voice control
          'aria-label': items.toString()
        }}
        MenuProps={{
          // a11y CRITICAL VOICE CONTROL FIX FOR CUSTOM MENUS
          disablePortal: true
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
