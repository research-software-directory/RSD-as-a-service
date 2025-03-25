// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SearchInput from '~/components/search/SearchInput'
import SelectRows from '~/components/software/overview/search/SelectRows'
import ViewToggleGroup, {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'

type ProfileSearchPanelProps={
  placeholder: string
  layout: ProjectLayoutType
  rows: number
  search: string | null
  onSetView: (view:ProjectLayoutType)=>void
  handleQueryChange: (key:string, value: string|string[])=>void
}

export default function ProfileSearchPanel({
  placeholder,layout,rows,search,
  onSetView,handleQueryChange
}:ProfileSearchPanelProps) {
  return (
    <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
      <SearchInput
        placeholder={placeholder}
        onSearch={(search: string) => handleQueryChange('search', search)}
        defaultValue={search ?? ''}
      />
      <ViewToggleGroup
        layout={layout}
        onSetView={onSetView}
        sx={{
          marginLeft:'0.5rem'
        }}
      />
      <SelectRows
        rows={rows}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )
}
