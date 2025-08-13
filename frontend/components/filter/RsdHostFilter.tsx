// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import FilterTitle from './FilterTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import {getRsdHost} from '~/components/software/overview/useSoftwareOverviewProps'

export type HostsFilterOption = {
  rsd_host: string
  rsd_host_cnt: number
}

type RsdSourceFilterProps = Readonly<{
  handleQueryChange: (key: string, value: string | string[]) => void
  hostsList: HostsFilterOption[],
  rsd_host?: string|null,
  title?: string
}>

export default function RsdHostFilter({rsd_host,hostsList,handleQueryChange,title='RSD Host'}: RsdSourceFilterProps) {

  // console.group('RsdSourceFilter')
  // console.log('rsd_host...',rsd_host)
  // console.log('hostsList...',hostsList)
  // console.groupEnd()

  return (
    <div>
      <FilterTitle
        title={title}
        count={hostsList.length ?? ''}
      />
      <FormControl
        data-testid="filters-order-by"
        fullWidth
        size="small"
        sx={{
          marginTop:'1rem'
        }}
      >
        <InputLabel id="hosts-by-label" sx={{color:'text.disabled'}}>{title}</InputLabel>
        <Select
          labelId="hosts-by-label"
          id="select-order-by"
          value={rsd_host ?? ''}
          label={title}
          onChange={(e) => {
            handleQueryChange('rsd_host', e.target.value ?? 'null')
          }}
          sx={{
            display:'flex',
            gap:'1rem',
            justifyContent:'space-between',
            fontSize:'0.875rem'
          }}
        >
          {
            hostsList.map(option => {
              // const label = getSelectOptionLabel(option)
              const label = getRsdHost({hasRemotes:true, rsd_host: option.rsd_host})
              return (
                <MenuItem
                  key={option.rsd_host}
                  value={option.rsd_host}
                  sx={{
                    display:'flex',
                    gap:'1rem',
                    justifyContent:'space-between',
                    fontSize:'0.875rem'
                  }}
                >
                  <span>{label}</span>
                  <span className="text-base-content-secondary ml-1">({option.rsd_host_cnt})</span>
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    </div>
  )
}
