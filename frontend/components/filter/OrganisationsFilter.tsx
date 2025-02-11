// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/filter/FilterTitle'
import FilterOption from '~/components/filter/FilterOption'

export type OrganisationOption = {
  organisation: string,
  organisation_cnt: number
}

type OrganisationFilterProps = {
  organisations: string[],
  organisationsList: OrganisationOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}

export default function OrganisationFilter({
  organisations, organisationsList,
  handleQueryChange, title = 'Participating organisations'
}: OrganisationFilterProps) {
  const [selected, setSelected] = useState<OrganisationOption[]>([])
  const [options, setOptions] = useState<OrganisationOption[]>(organisationsList)

  // console.group('OrganisationFilter')
  // console.log('organisationsList...', organisationsList)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (organisations.length > 0 && organisationsList.length) {
      const selectedOptions = organisationsList.filter(option => {
        return organisations.includes(option.organisation)
      })
      setSelected(selectedOptions)
    } else {
      setSelected([])
    }
    setOptions(organisationsList)
  },[organisations,organisationsList])

  return (
    <>
      <FilterTitle
        title={title}
        count={organisationsList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => (option.organisation)}
        isOptionEqualToValue={(option, value) => {
          return option.organisation === value.organisation
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={({key,...props}, option) => (
          <FilterOption
            key={key ?? option.organisation}
            props={props}
            label={option.organisation}
            count={option.organisation_cnt}
            capitalize={false}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.organisation)
          handleQueryChange('organisations', queryFilter)
        }}
      />
    </>
  )
}
