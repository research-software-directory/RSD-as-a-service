// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export const softwareOrderOptions = [
  {key: 'contributor_cnt', label: 'Contributors', direction:'desc.nullslast'},
  {key: 'mention_cnt', label: 'Mentions', direction:'desc.nullslast'},
  {key: 'brand_name', label: 'Name', direction:'asc'},
]

type OrderByProps = {
  orderBy: string
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function OrderBy({orderBy,handleQueryChange}:OrderByProps) {
  return (
    <FormControl
      data-testid="filters-order-by"
      fullWidth
      size="small"
    >
      <InputLabel id="order-by-label">Order by</InputLabel>
      <Select
        labelId="order-by-label"
        id="select-order-by"
        value={orderBy}
        label="Order by"
        onChange={(e) => {
          handleQueryChange('order', e.target.value)
        }}
      >
        {
          softwareOrderOptions.map(option => <MenuItem key={option.key} value={option.key}>{option.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}
