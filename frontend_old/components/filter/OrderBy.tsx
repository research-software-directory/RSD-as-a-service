// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export type OrderOption = {
  key: string,
  label: string,
  direction: string
}

export type OrderByProps = {
  order: string
  handleQueryChange: (key: string, value: string | string[]) => void
  options: OrderOption[],
  title?: string
}

export default function OrderBy({order,handleQueryChange,options=[],title='Order by'}: OrderByProps) {
  return (
    <FormControl
      data-testid="filters-order-by"
      fullWidth
      size="small"
    >
      <InputLabel id="order-by-label">{title}</InputLabel>
      <Select
        labelId="order-by-label"
        id="select-order-by"
        value={order}
        label={title}
        onChange={(e) => {
          handleQueryChange('order', e.target.value)
        }}
      >
        {
          options.map(option => <MenuItem key={option.key} value={option.key}>{option.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}
