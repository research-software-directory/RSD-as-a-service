// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {LicensesFilterOption} from './softwareFiltersApi'
import FilterTitle from '../../../layout/filter/FilterTitle'
import FilterOption from '../../../layout/filter/FilterOption'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'


type LicensesFilterProps = {
  licenses: string[],
  licensesList: LicensesFilterOption[],
}

export default function LicensesFilter({licenses, licensesList}: LicensesFilterProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
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
      <FilterTitle
        title="Licenses"
        count={licensesList.length ?? ''}
      />
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
          <FilterOption
            key={option.license}
            props={props}
            label={option.license}
            count={option.license_cnt}
          />
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
