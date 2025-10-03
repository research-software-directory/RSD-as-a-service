// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

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
      {/* need to add it for accessibility - Lighthouse audit */}
      <InputLabel id="select-items" className="opacity-0">Items</InputLabel>
      <Select
        id="select-rows"
        labelId="select-items"
        variant="outlined"
        value={items}
        // label="Items"
        onChange={({target}) =>{
          // console.log('items...', target.value)
          onItemsChange(target.value)
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
