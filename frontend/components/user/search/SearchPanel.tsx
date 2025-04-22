// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SearchInput from '~/components/search/SearchInput'
import ViewToggleGroup, {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import ItemsPerPage from './ItemsPerPage'

export type SearchPanelProps=Readonly<{
  placeholder: string
  layout: ProjectLayoutType
  rows: number
  search: string | null
  onSearch: (search: string) => void
  onSetView: (view:ProjectLayoutType)=>void
  onSetRows: (rows: number)=>void
}>

export default function SearchPanel({
  placeholder,layout,rows,search,
  onSearch,onSetView,onSetRows
}:SearchPanelProps) {
  return (
    <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
      <SearchInput
        placeholder={placeholder}
        onSearch={onSearch}
        defaultValue={search ?? ''}
      />
      <ViewToggleGroup
        layout={layout}
        onSetView={onSetView}
        sx={{
          marginLeft:'0.5rem'
        }}
      />
      <ItemsPerPage
        items={rows}
        onItemsPerPage={onSetRows}
      />
    </div>
  )
}
