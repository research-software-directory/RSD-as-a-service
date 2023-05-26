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

export type ResearchDomainOption = {
  key: string
  domain: string,
  domain_cnt: number
}

type ResearchDomainFilterProps = {
  domains: string[],
  domainsList: ResearchDomainOption[]
}

export default function ResearchDomainFilter({domains, domainsList}: ResearchDomainFilterProps) {
  const {handleQueryChange} = useProjectOverviewParams()
  const [selected, setSelected] = useState<ResearchDomainOption[]>([])
  const [options, setOptions] = useState<ResearchDomainOption[]>(domainsList)

  // console.group('ResearchDomainFilter')
  // console.log('domainsList...', domainsList)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (domains.length > 0 && domainsList.length) {
      const selectedKeywords = domainsList.filter(option => {
        return domains.includes(option.key)
      })
      setSelected(selectedKeywords)
    } else {
      setSelected([])
    }
    setOptions(domainsList)
  },[domains,domainsList])

  return (
    <div>
      <FilterTitle
        title="Research domains"
        count={domainsList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => (option.domain)}
        isOptionEqualToValue={(option, value) => {
          return option.domain === value.domain
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <FilterOption
            key={option.domain}
            props={props}
            label={option.domain}
            count={option.domain_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Research domain"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.key)
          handleQueryChange('domains', queryFilter)
        }}
      />
    </div>
  )
}
