// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import FilterPopover from '~/components/filter/FilterPopover'
import KeywordFilter from '~/components/keyword/KeywordFilter'
import {findSoftwareWithKeyword} from './keywordForSoftware'

type KeywordFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function SoftwareFilter({items = [], onApply}: KeywordFilterProps) {
  const [selectedKeywords, setSelectedKeywords] = useState(items)

  function onClear() {
    setSelectedKeywords([])
    onApply([])
  }

  function handleApply(items: string[]) {
    setSelectedKeywords(items)
    onApply(items)
  }

  function renderMessage() {
    if (selectedKeywords.length === 0) {
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
      filterTooltip={`Filter: ${selectedKeywords.length > 0 ? selectedKeywords.join(' + ') : 'None'}`}
      badgeContent={selectedKeywords.length}
      disableClear={selectedKeywords.length === 0}
      onClear={onClear}
    >
      <KeywordFilter
        items={selectedKeywords}
        searchApi={findSoftwareWithKeyword}
        onApply={handleApply}
      />
      {renderMessage()}
    </FilterPopover>
  )
}
