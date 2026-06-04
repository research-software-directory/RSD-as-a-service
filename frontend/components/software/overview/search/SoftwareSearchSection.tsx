// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {JSX, useState} from 'react'
import Button from '@mui/material/Button'

import {getPageRange} from '~/utils/pagination'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import useSmallScreen from '~/config/useSmallScreen'
import {useUserSettings} from '~/config/UserSettingsContext'
import StatusForReaders from '~/components/a11y/StatusForReaders'
import FiltersModal from '~/components/filter/FiltersModal'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import {searchOverviewMsg} from '~/components/search/searchOverviewMsg'
import useSoftwareParams from '~/components/software/overview/useSoftwareParams'

type SearchSectionProps = {
  count: number
  filterModal?: JSX.Element
}

export default function SoftwareSearchSection({
  count, filterModal
}: SearchSectionProps) {
  const smallScreen = useSmallScreen()
  const {handleQueryChange} = useHandleQueryChange()
  const {setPageLayout,setPageRows} = useUserSettings()
  const {search,page,rows,view,filterCnt} = useSoftwareParams()
  const [modal, setModal] = useState(false)

  // a11y screen reader announcements and placeholder
  const {announcement,placeholder} = searchOverviewMsg({
    name: 'software items',
    count,
    page,
    rows,
    filterCnt,
    search
  })

  return (
    <section
      aria-label="Find software"
      data-testid="search-section">
      {/* a11y screen reader announcer */}
      <StatusForReaders message={announcement} />
      <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
        <SearchInput
          placeholder={placeholder}
          onSearch={(search: string) => handleQueryChange('search', search)}
          defaultValue={search ?? ''}
        />
        <ToggleViewGroup
          options={['grid','list','masonry']}
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
          : null
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
