// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import {KeywordFilterOption} from './softwareFiltersApi'

type KeywordsFilterProps = {
  keywords: string[],
  keywordsList: KeywordFilterOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function KeywordsFilter({keywords,keywordsList,handleQueryChange}:KeywordsFilterProps) {
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
      <div className="flex justify-between items-center">
        <div className="font-semibold">Keywords</div>
        <div className="text-sm opacity-60">{keywordsList.length}</div>
      </div>
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
          <li className="flex w-full items-center content-between" {...props} >
            <div className="text-sm flex-1">{
              option.keyword
            }</div>
            <div className="text-xs opacity-60">({
              option.keyword_cnt
            })
            </div>
          </li>
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
