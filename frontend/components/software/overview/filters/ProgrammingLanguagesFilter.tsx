// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import {LanguagesFilterOption} from './softwareFiltersApi'
import FilterTitle from '../../../layout/filter/FilterTitle'
import FilterOption from '../../../layout/filter/FilterOption'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'

type ProgrammingLanguagesFilterProps = {
  prog_lang: string[],
  languagesList: LanguagesFilterOption[]
}

export default function ProgrammingLanguagesFilter({prog_lang, languagesList}: ProgrammingLanguagesFilterProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
  const [selected, setSelected] = useState<LanguagesFilterOption[]>([])

  useEffect(() => {
    if (prog_lang.length > 0 && languagesList.length > 0) {
      const selectedProgLang = languagesList.filter(option => {
        return prog_lang.includes(option.prog_language)
      })
      setSelected(selectedProgLang)
    } else {
      setSelected([])
    }
  },[prog_lang,languagesList])

  return (
    <div>
      <FilterTitle
        title="Program languages"
        count={languagesList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={languagesList}
        getOptionLabel={(option) => option.prog_language}
        isOptionEqualToValue={(option, value) => {
          return option.prog_language === value.prog_language
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <FilterOption
            key={option.prog_language}
            props={props}
            label={option.prog_language}
            count={option.prog_language_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Program languages"/>
        )}
        onChange={(_, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.prog_language)
          // update query url
          handleQueryChange('prog_lang', queryFilter)
        }}
      />
    </div>
  )
}
