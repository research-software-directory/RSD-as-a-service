// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '../../../layout/filter/FilterTitle'
import FilterOption from '../../../layout/filter/FilterOption'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'

export type KeywordFilterOption = {
  keyword: string
  keyword_cnt: number
}


type SoftwareKeywordsFilterProps = {
  keywords: string[],
  keywordsList: KeywordFilterOption[]
}

export default function SoftwareKeywordsFilter({keywords, keywordsList}: SoftwareKeywordsFilterProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
  const [selected, setSelected] = useState<KeywordFilterOption[]>([])
  const [options, setOptions] = useState<KeywordFilterOption[]>(keywordsList)

  // console.group('KeywordsFilter')
  // console.log('keywordsList...', keywordsList)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (keywords.length > 0 && keywordsList.length) {
      const selectedKeywords = keywordsList.filter(option => {
        return keywords.includes(option.keyword)
      })
      setSelected(selectedKeywords)
    } else {
      setSelected([])
    }
    setOptions(keywordsList)
  },[keywords,keywordsList])

  return (
    <div>
      <FilterTitle
        title="Keywords"
        count={keywordsList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => (option.keyword)}
        isOptionEqualToValue={(option, value) => {
          return option.keyword === value.keyword
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <FilterOption
            key={option.keyword}
            props={props}
            label={option.keyword}
            count={option.keyword_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Keywords"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.keyword)
          handleQueryChange('keywords', queryFilter)
        }}
      />
    </div>
  )
}
