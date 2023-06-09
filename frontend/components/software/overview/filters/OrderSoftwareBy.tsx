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
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'

export const softwareOrderOptions = [
  {key: 'contributor_cnt', label: 'Contributors', direction:'desc.nullslast'},
  {key: 'mention_cnt', label: 'Mentions', direction:'desc.nullslast'},
  {key: 'brand_name', label: 'Name', direction:'asc'},
]

type OrderByProps = {
  orderBy: string
}

export default function OrderSoftwareBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
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
