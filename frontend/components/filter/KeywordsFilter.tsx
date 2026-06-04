// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/filter/FilterTitle'
import FilterOption from '~/components/filter/FilterOption'
import StatusForReaders from '~/components/a11y/StatusForReaders'
import {screenReaderFilterMsg, ariaOptionLabel} from './screenReaderFilterMsg'

export type KeywordFilterOption = {
  keyword: string
  keyword_cnt: number
}

type KeywordsFilterProps = {
  keywords: string[],
  keywordsList: KeywordFilterOption[],
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}

/**
 * Shared component used on software overview,
 * project overview, organisation/projects, organisation/software
 * pages
 */
export default function KeywordsFilter({keywords, keywordsList, handleQueryChange, title='Keywords'}: KeywordsFilterProps) {
  const [selected, setSelected] = useState<KeywordFilterOption[]>([])
  const [options, setOptions] = useState<KeywordFilterOption[]>(keywordsList)

  useEffect(() => {
    if (keywords && keywordsList &&
      keywords.length > 0 && keywordsList.length > 0) {
      const selectedKeywords = keywordsList.filter(option => {
        // we need to make values from various RSD instances "comparable"
        // keyword field is of type CITEXT which is not case sensitive
        // so the api search will match all case insensitive entries
        // and we need to do the same here
        return keywords
          .map(item=>item.toLocaleLowerCase())
          .includes(option.keyword.toLocaleLowerCase())
      })
      setSelected(selectedKeywords)
    } else {
      setSelected([])
    }
    setOptions(keywordsList)
  },[keywords,keywordsList])

  const message = screenReaderFilterMsg({
    name: title,
    selected: selected.map(item => item.keyword),
    optionCnt: options?.length
  })

  // console.group('KeywordsFilter')
  // console.log('keywords...', keywords)
  // console.log('keywordsList...', keywordsList)
  // console.log('options...', options)
  // console.log('selected...', selected)
  // console.log('selectionContext...', selectionContext)
  // console.groupEnd()

  return (
    <>
      <FilterTitle
        title={title}
        count={keywordsList.length ?? 0}
      />
      {/* a11y screen reader announcer */}
      <StatusForReaders message={message}/>
      <Autocomplete
        className="mt-4"
        disabled={options?.length===0}
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
        renderOption={({key,...props}, option) => {
          // a11y provide descriptive audio fallback for menu lines
          const accessibleOptionLabel = ariaOptionLabel({
            name: option.keyword,
            count: option.keyword_cnt
          })
          return (
            <FilterOption
              key={key ?? option.keyword}
              props={{
                ...props,
                'aria-label': accessibleOptionLabel
              }}
              label={option.keyword}
              count={option.keyword_cnt}
            />
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={title}
          />
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.keyword)
          handleQueryChange('keywords', queryFilter)
        }}
      />
    </>
  )
}
