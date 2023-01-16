// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import FilterPopover from '~/components/filter/FilterPopover'
import KeywordFilter from '~/components/keyword/KeywordFilter'
import ProgrammingLanguageFilter from './ProgrammingLanguageFilter'
import {searchForKeyword,searchForProgrammingLanguage} from './softwareFilterApi'

export type SoftwareFilterProps = {
  keywords: string[],
  prog_lang: string[],
  onApply: ({keywords,prog_lang}:{keywords: string[],prog_lang: string[] }) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function SoftwareFilter({keywords = [], prog_lang=[], onApply}: SoftwareFilterProps) {
  const [selectedKeywords, setSelectedKeywords] = useState(keywords)
  const [selectedLanguages, setSelectedLanguages] = useState(prog_lang)
  const selectedItems = [
    ...selectedKeywords,
    ...selectedLanguages
  ]

  function onClear() {
    setSelectedKeywords([])
    setSelectedLanguages([])
    onApply({keywords:[],prog_lang:[]})
  }

  function applyKeywords(keywords: string[]) {
    setSelectedKeywords(keywords)
    onApply({
      keywords,
      prog_lang: selectedLanguages
    })
  }

  function applyLanguages(prog_lang: string[]) {
    setSelectedLanguages(prog_lang)
    onApply({
      keywords: selectedKeywords,
      prog_lang
    })
  }

  function renderMessage() {
    if (selectedItems.length === 0) {
      return (
        <Alert severity="info" sx={{margin: '1rem'}}>
          <AlertTitle sx={{fontWeight: 500}}>No filter active</AlertTitle>
          Select a keyword from the list <strong>or type to search</strong>.
        </Alert>
      )
    }
    return <div className="py-2"></div>
  }

  return (
    <FilterPopover
      title="Filter software"
      filterTooltip={`Filter: ${selectedItems.length > 0 ? selectedItems.join(' + ') : 'None'}`}
      badgeContent={selectedItems.length}
      disableClear={selectedItems.length === 0}
      onClear={onClear}
    >
      <KeywordFilter
        items={selectedKeywords}
        searchApi={searchForKeyword}
        onApply={applyKeywords}
      />
      <ProgrammingLanguageFilter
        items={selectedLanguages}
        searchApi={searchForProgrammingLanguage}
        onApply={applyLanguages}
      />
      {renderMessage()}
    </FilterPopover>
  )
}
