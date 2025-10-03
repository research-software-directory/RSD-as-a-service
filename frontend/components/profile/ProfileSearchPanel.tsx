// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import {useUserSettings} from '~/config/UserSettingsContext'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup, {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'

type ProfileSearchPanelProps={
  placeholder: string
  view: ProjectLayoutType
  rows: number
  search?: string | null
}

export default function ProfileSearchPanel({
  placeholder,view,rows,search
}:ProfileSearchPanelProps) {
  const {setPageLayout,setPageRows} = useUserSettings()
  const {handleQueryChange} = useHandleQueryChange()
  return (
    <div className="flex rounded-md bg-base-100 p-2">
      <SearchInput
        placeholder={placeholder}
        onSearch={(search: string) => handleQueryChange('search', search)}
        defaultValue={search ?? ''}
      />
      <ToggleViewGroup
        view={view}
        onChangeView={setPageLayout}
        sx={{
          marginLeft:'0.5rem'
        }}
      />
      <ShowItemsSelect
        items={rows}
        onItemsChange={(items)=>{
          setPageRows(items)
          handleQueryChange('rows', items.toString())
        }}
      />
    </div>
  )
}
