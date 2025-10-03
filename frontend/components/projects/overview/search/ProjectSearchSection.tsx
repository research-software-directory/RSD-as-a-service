// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {JSX, useState} from 'react'
import Button from '@mui/material/Button'

import {useUserSettings} from '~/config/UserSettingsContext'
import {getPageRange} from '~/utils/pagination'
import useSmallScreen from '~/config/useSmallScreen'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import SearchInput from '~/components/search/SearchInput'
import FiltersModal from '~/components/filter/FiltersModal'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import useProjectParams from '~/components/projects/overview/useProjectParams'

type SearchSectionProps = {
  count: number
  filterModal?: JSX.Element
}

export default function ProjectSearchSection({
  count, filterModal
}: SearchSectionProps) {
  const smallScreen = useSmallScreen()
  const {search,page,rows,view,filterCnt} = useProjectParams()
  const {setPageLayout,setPageRows} = useUserSettings()
  const {handleQueryChange} = useHandleQueryChange()
  const [modal, setModal] = useState(false)

  const placeholder = filterCnt > 0 ? 'Find within selection' : 'Find project'

  // console.group('ProjectSearchSection')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.groupEnd()

  return (
    <section data-testid="search-section">
      <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
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
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          {getPageRange(rows, page, count)}
        </div>
        {smallScreen && filterModal ?
          <Button
            onClick={() => setModal(true)}
            variant="outlined"
          >
            Filters
          </Button>
          :null
        }
      </div>

      {smallScreen && filterModal ?
        <FiltersModal
          open={modal}
          setModal={setModal}
        >
          {filterModal}
        </FiltersModal>
        : null
      }
    </section>
  )
}
