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
import useProjectOverviewParams from '../useProjectOverviewParams'

export const projectOrderOptions = [
  {key: 'impact_cnt', label: 'Impact', direction:'desc.nullslast'},
  {key: 'output_cnt', label: 'Output', direction:'desc.nullslast'},
  {key: 'date_start', label: 'Start date', direction: 'desc.nullslast'},
  {key: 'date_end', label: 'End date', direction:'asc.nullslast'},
]

type OrderByProps = {
  orderBy: string
}

export default function OrderProjectsBy({orderBy}: OrderByProps) {
  const {handleQueryChange} = useProjectOverviewParams()
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
          projectOrderOptions.map(option => <MenuItem key={option.key} value={option.key}>{option.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}
