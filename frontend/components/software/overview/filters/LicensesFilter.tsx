// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {LicensesFilterOption} from './softwareFiltersApi'


type LicensesFilterProps = {
  licenses: string[],
  licensesList: LicensesFilterOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function LicensesFilter({licenses,licensesList,handleQueryChange}:LicensesFilterProps) {
  const [selected, setSelected] = useState<LicensesFilterOption[]>([])

  useEffect(() => {
    if (licenses.length > 0 && licensesList.length > 0) {
      const selected = licensesList.filter(option => {
        return licenses.includes(option.license)
      })
      setSelected(selected)
    } else {
      setSelected([])
    }
  },[licenses,licensesList])

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="font-semibold">Licenses</div>
        <div className="text-sm opacity-60">{licensesList.length}</div>
      </div>
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={licensesList}
        getOptionLabel={(option) => option.license}
        isOptionEqualToValue={(option, value) => {
          return option.license === value.license
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <li className="flex items-center w-full content-between" {...props} >
            <div className="flex-1 text-sm">{option.license}</div>
            <div className="text-xs opacity-60">({option.license_cnt})</div>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Licenses"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.license)
          // update query url
          handleQueryChange('licenses', queryFilter)
        }}
      />
    </div>
  )
}
