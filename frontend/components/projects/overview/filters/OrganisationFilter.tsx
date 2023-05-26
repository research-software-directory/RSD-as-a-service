// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/layout/filter/FilterTitle'
import FilterOption from '~/components/layout/filter/FilterOption'
import useProjectOverviewParams from '../useProjectOverviewParams'

export type OrganisationOption = {
  organisation: string,
  organisation_cnt: number
}

type OrganisationFilterProps = {
  organisations: string[],
  organisationsList: OrganisationOption[]
}

export default function OrganisationFilter({organisations, organisationsList}: OrganisationFilterProps) {
  const {handleQueryChange} = useProjectOverviewParams()
  const [selected, setSelected] = useState<OrganisationOption[]>([])
  const [options, setOptions] = useState<OrganisationOption[]>(organisationsList)

  // console.group('OrganisationFilter')
  // console.log('organisationsList...', organisationsList)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (organisations.length > 0 && organisationsList.length) {
      const selectedKeywords = organisationsList.filter(option => {
        return organisations.includes(option.organisation)
      })
      setSelected(selectedKeywords)
    } else {
      setSelected([])
    }
    setOptions(organisationsList)
  },[organisations,organisationsList])

  return (
    <div>
      <FilterTitle
        title="Participating organisations"
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
        renderOption={(props, option) => (
          <FilterOption
            key={option.organisation}
            props={props}
            label={option.organisation}
            count={option.organisation_cnt}
            capitalize={false}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Organisation"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.organisation)
          handleQueryChange('organisations', queryFilter)
        }}
      />
    </div>
  )
}
