// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup, {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import ItemsPerPage from './ItemsPerPage'

export type SearchPanelProps=Readonly<{
  placeholder: string
  layout: ProjectLayoutType
  rows: number
  search?: string
  onSearch: (search: string) => void
  onSetView: (view: ProjectLayoutType)=>void
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
        defaultValue={search}
      />
      <ToggleViewGroup
        view={layout}
        onChangeView={onSetView}
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
