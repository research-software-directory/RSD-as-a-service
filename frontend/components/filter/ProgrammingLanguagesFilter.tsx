// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import StatusForReaders from '~/components/a11y/StatusForReaders'
import FilterTitle from './FilterTitle'
import FilterOption from './FilterOption'
import {
  screenReaderFilterMsg,
  ariaOptionLabel
} from './screenReaderFilterMsg'

export type LanguagesFilterOption = {
  prog_language: string
  prog_language_cnt: number
}

type ProgrammingLanguagesFilterProps = {
  prog_lang: string[],
  languagesList: LanguagesFilterOption[]
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}

export default function ProgrammingLanguagesFilter({prog_lang,languagesList,handleQueryChange,title='Programming languages'}: Readonly<ProgrammingLanguagesFilterProps>) {
  const [selected, setSelected] = useState<LanguagesFilterOption[]>([])
  const [options, setOptions] = useState<LanguagesFilterOption[]>(languagesList)

  useEffect(() => {
    if (prog_lang.length > 0 && languagesList.length > 0) {
      const selectedProgLang = languagesList.filter(option => {
        return prog_lang.includes(option.prog_language)
      })
      setSelected(selectedProgLang)
    } else {
      setSelected([])
    }
    setOptions(languagesList)
  },[prog_lang,languagesList])

  const message = screenReaderFilterMsg({
    name: title,
    selected: selected.map(item => item.prog_language),
    optionCnt: options?.length
  })

  return (
    <>
      <FilterTitle
        title={title}
        count={languagesList.length ?? ''}
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
        getOptionLabel={(option) => option.prog_language}
        isOptionEqualToValue={(option, value) => {
          return option.prog_language === value.prog_language
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={({key, ...props}, option) => {
          // a11y provide descriptive audio fallback for menu lines
          const accessibleOptionLabel = ariaOptionLabel({
            name: option.prog_language,
            count: option.prog_language_cnt
          })
          return (
            <FilterOption
              key={key ?? option.prog_language}
              props={{
                ...props,
                'aria-label': accessibleOptionLabel
              }}
              label={option.prog_language}
              count={option.prog_language_cnt}
            />
          )
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(_, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.prog_language)
          // update query url
          handleQueryChange('prog_lang', queryFilter)
        }}
      />
    </>
  )
}
