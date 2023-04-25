// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

type OrderByProps = {
  orderBy: string
  setOrderBy: (order:string)=>void
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function OrderBy({orderBy,setOrderBy,handleQueryChange}:OrderByProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-label">Order by</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={orderBy}
        label="Order by"
        onChange={(e) => {
          setOrderBy(e.target.value)
          handleQueryChange('order', e.target.value)
        }}
      >
        <MenuItem value={'contributor_cnt'}>Contributions</MenuItem>
        <MenuItem value={'mention_cnt'}>Mentions</MenuItem>
      </Select>
    </FormControl>
  )
}
