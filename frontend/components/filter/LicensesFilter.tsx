// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import FilterTitle from './FilterTitle'
import FilterOption from './FilterOption'

export type LicensesFilterOption = {
  license: string
  license_cnt: number
}

type LicensesFilterProps = {
  licenses: string[],
  licensesList: LicensesFilterOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}

export default function LicensesFilter({licenses, licensesList,handleQueryChange,title='Licenses'}: LicensesFilterProps) {
  const [selected, setSelected] = useState<LicensesFilterOption[]>([])
  const [options, setOptions] = useState<LicensesFilterOption[]>(licensesList)

  useEffect(() => {
    if (licenses.length > 0 && licensesList.length > 0) {
      const selected = licensesList.filter(option => {
        return licenses.includes(option.license)
      })
      setSelected(selected)
    } else {
      setSelected([])
    }
    setOptions(licensesList)
  },[licenses,licensesList])

  return (
    <>
      <FilterTitle
        title={title}
        count={licensesList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => option.license}
        isOptionEqualToValue={(option, value) => {
          return option.license === value.license
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={({key,...props}, option) => (
          <FilterOption
            key={key ?? option.license}
            props={props}
            label={option.license}
            count={option.license_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(_, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.license)
          // update query url
          handleQueryChange('licenses', queryFilter)
        }}
      />
    </>
  )
}
