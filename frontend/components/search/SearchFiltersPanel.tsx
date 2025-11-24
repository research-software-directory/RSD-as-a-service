// SPDX-FileCopyrightText: 2025 Jesse Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FilterTitle from '~/components/filter/FilterTitle'
import {RsdModuleName} from '~/config/rsdSettingsReducer'
import useRsdSettings from '~/config/useRsdSettings'

type SearchFiltersPanelProps = {
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  resultCounts: Record<string, number>
  activeModules: string[]
}


export default function SearchFiltersPanel({
  selectedTypes,
  onTypesChange,
  resultCounts,
  activeModules
}: SearchFiltersPanelProps) {

  const {modules} = useRsdSettings()


  function handleTypeChange(type: string, checked: boolean) {
    if (checked) {
      onTypesChange([...selectedTypes, type])
    } else {
      onTypesChange(selectedTypes.filter(t => t !== type))
    }
  }

  function handleSelectAll() {
    onTypesChange(activeModules)
  }

  function handleClearAll() {
    onTypesChange([])
  }

  // Get count for each type (use real counts from resultCounts)
  const typeCounts = activeModules.map(module => ({
    type: module as RsdModuleName,
    count: resultCounts[module] || 0
  }))

  const totalResults = typeCounts.reduce((sum, item) => sum + item.count, 0)
  const allSelected = selectedTypes.length === activeModules.length
  const noneSelected = selectedTypes.length === 0

  return (
    <div className="bg-base-100 mt-4 p-4 shadow-sm rounded-md">
      <FilterTitle
        title="Filter by Type"
        count={totalResults}
      />

      <div className="mt-2 mb-3 flex gap-2 text-sm">
        <button
          onClick={handleSelectAll}
          disabled={allSelected}
          className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
        >
          Select all
        </button>
        <span className="text-base-content-secondary">|</span>
        <button
          onClick={handleClearAll}
          disabled={noneSelected}
          className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
        >
          Clear all
        </button>
      </div>

      <FormGroup>
        {typeCounts.map(({type, count}) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={(e) => handleTypeChange(type, e.target.checked)}
                size="small"
              />
            }
            label={
              <div className="flex justify-between items-center w-full">
                <span className="text-sm capitalize">
                  {modules[type]?.menuItem || type}
                </span>
                <span className="text-xs text-base-content-secondary ml-2">
                  ({count})
                </span>
              </div>
            }
            sx={{
              width: '100%',
              marginLeft: 0,
              marginRight: 0,
              '& .MuiFormControlLabel-label': {
                width: '100%',
                display: 'flex'
              }
            }}
          />
        ))}
      </FormGroup>

      {noneSelected && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded text-sm ">
          No types selected. Please select at least one type to view results.
        </div>
      )}
    </div>
  )
}
