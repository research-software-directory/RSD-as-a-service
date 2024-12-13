// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import FilterTitle from './FilterTitle'
import FilterOption from './FilterOption'

export type SourcesFilterOption = {
  source: string
  source_cnt: number
}

type RsdSourceFilterProps = Readonly<{
  sources: string[],
  sourcesList: SourcesFilterOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}>

export default function RsdSourceFilter({sources, sourcesList,handleQueryChange,title='Host RSD'}: RsdSourceFilterProps) {
  const [selected, setSelected] = useState<SourcesFilterOption[]>([])
  const [options, setOptions] = useState<SourcesFilterOption[]>(sourcesList)

  useEffect(() => {
    if (sources.length > 0 && sourcesList.length > 0) {
      const selected = sourcesList.filter(option => {
        return sources.includes(option.source)
      })
      setSelected(selected)
    } else {
      setSelected([])
    }
    setOptions(sourcesList)
  },[sources,sourcesList])

  return (
    <div>
      <FilterTitle
        title={title}
        count={sourcesList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => option.source}
        isOptionEqualToValue={(option, value) => {
          return option.source === value.source
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <FilterOption
            key={option.source}
            props={props}
            label={option.source}
            count={option.source_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(_, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.source)
          // update query url
          handleQueryChange('sources', queryFilter)
        }}
      />
    </div>
  )
}
