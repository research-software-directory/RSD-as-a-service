// SPDX-FileCopyrightText: 2025 Jesse Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import {GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/apiGlobalSearch'
import {useUserSettings} from '~/config/UserSettingsContext'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import SearchResultsContent from './SearchResultsContent'
import SearchFiltersPanel from './SearchFiltersPanel'

type SearchResultsClientProps = Readonly<{
  query: string
  groupedResults: {[key: string]: GlobalSearchResults[]}
  resultCounts: Record<string, number>
  view: string
  activeModules: string[]
}>

export default function SearchResultsClient({
  query,
  groupedResults,
  resultCounts,
  view: initialView,
  activeModules
}: SearchResultsClientProps) {
  const {handleQueryChange} = useHandleQueryChange(false)
  const {rsd_page_layout, setPageLayout} = useUserSettings()

  // Use URL view param if present, otherwise fall back to user settings
  const view = initialView || (rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout)

  // State for filtering by type
  const [selectedTypes, setSelectedTypes] = useState<string[]>(activeModules)

  // Filter grouped results based on selected types
  const filteredGroupedResults = Object.keys(groupedResults).reduce((acc, key) => {
    if (selectedTypes.includes(key)) {
      acc[key] = groupedResults[key]
    }
    return acc
  }, {} as {[key: string]: GlobalSearchResults[]})

  // Calculate total real count from resultCounts
  const totalRealCount = Object.values(resultCounts).reduce((sum, count) => sum + count, 0)

  // Count filtered results (use real counts when available)
  const filteredCount = selectedTypes.reduce((sum, type) => {
    return sum + (resultCounts[type] || 0)
  }, 0)

  function handleViewChange(newView: string) {
    setPageLayout(newView as 'grid' | 'list' | 'masonry')
    handleQueryChange('view', newView)
  }

  function handleSearch(searchTerm: string) {
    handleQueryChange('q', searchTerm)
  }

  return (
    <div className="flex gap-4">
      {/* Left sidebar - Filters */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-4">
          <SearchFiltersPanel
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            resultCounts={resultCounts}
            activeModules={activeModules}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap mt-4 py-8 px-4 rounded-lg bg-base-100/70 backdrop-blur-xl lg:sticky top-4 border border-base-200 z-11 ">
          <h1 className="mr-4 lg:flex-1">
            Search Results
          </h1>
          <div className="flex-2 flex min-w-[20rem]">
            <SearchInput
              placeholder="Search for software, projects, organisations..."
              onSearch={handleSearch}
              defaultValue={query}
              autoFocus={true}
              // self focus when component mounts
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  border: '1px solid',
                  borderColor: 'divider'
                },
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '2px'
                }
              }}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.72217 0.34082C2.86783 0.34082 0.559204 2.64944 0.559204 5.50378C0.559204 8.35812 2.86783 10.6667 5.72217 10.6667C6.74123 10.6667 7.68438 10.3678 8.48397 9.86003L12.2138 13.5899L13.5046 12.2992L9.82216 8.62624C10.4841 7.75783 10.8851 6.68182 10.8851 5.50378C10.8851 2.64944 8.57651 0.34082 5.72217 0.34082ZM5.72217 1.55564C7.90859 1.55564 9.67031 3.31735 9.67031 5.50378C9.67031 7.69021 7.90859 9.45193 5.72217 9.45193C3.53574 9.45193 1.77402 7.69021 1.77402 5.50378C1.77402 3.31735 3.53574 1.55564 5.72217 1.55564Z"
                        fill="currentColor"
                        opacity="0.7"
                      />
                    </svg>
                  </InputAdornment>
                )
              }}
            />
            <ToggleViewGroup
              view={view}
              onChangeView={handleViewChange}
              sx={{
                marginLeft: '0.5rem'
              }}
            />
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 text-base-content-secondary">
          {query === '' ? (
            <p>Enter a search term to find software, projects, organisations and more.</p>
          ) : (
            <p>
              Found {filteredCount} result{filteredCount !== 1 ? 's' : ''}
              {filteredCount !== totalRealCount && ` (filtered from ${totalRealCount})`}
            </p>
          )}
        </div>

        {/* Results */}
        <SearchResultsContent
          groupedResults={filteredGroupedResults}
          resultCounts={resultCounts}
          view={view}
        />
      </div>
    </div>
  )
}
