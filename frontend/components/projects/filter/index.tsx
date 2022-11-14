// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import FilterPopover from '~/components/filter/FilterPopover'
import KeywordFilter from '~/components/keyword/KeywordFilter'
import {ResearchDomain, searchForResearchDomain, searchForKeyword} from './projectFilterApi'
import ResearchDomainFilter, {getDomainLabels} from './ResearchDomainFilter'

type ProjectFilterProps = {
  keywords: string[],
  domains: ResearchDomain[],
  onApply: ({keywords,domains}:{keywords: string[],domains:string[]}) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function ProjectFilter({keywords = [], domains = [], onApply}: ProjectFilterProps) {
  const [selectedKeywords, setSelectedKeywords] = useState(keywords)
  const [selectedDomains, setSelectedDomains] = useState(domains)
  const selectedItems = [
    ...selectedKeywords,
    ...getDomainLabels(selectedDomains)
  ]

  function onClear() {
    setSelectedKeywords([])
    setSelectedDomains([])
    onApply({keywords: [], domains: []})
  }

  function applyKeywords(keywords: string[]) {
    setSelectedKeywords(keywords)
    onApply({
      keywords,
      domains: selectedDomains.map(item=>item.key)
    })
  }

  function applyDomains(domains: ResearchDomain[]) {
    setSelectedDomains(domains)
    const keys = domains.map(item => item.key)
    onApply({
      keywords: selectedKeywords,
      domains: keys
    })
  }

  function renderMessage() {
    if (selectedItems.length === 0) {
      return (
        <Alert severity="info" sx={{margin: '1rem'}}>
          <AlertTitle sx={{fontWeight: 500}}>No filter active</AlertTitle>
          Select a keyword or research domain from the list, <strong>or type to search</strong>.
        </Alert>
      )
    }
    return <div className="py-2"></div>
  }

  return (
    <FilterPopover
      title="Filter projects"
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
      <ResearchDomainFilter
        items={selectedDomains}
        searchApi={searchForResearchDomain}
        onApply={applyDomains}
      />
      {renderMessage()}
    </FilterPopover>
  )
}
