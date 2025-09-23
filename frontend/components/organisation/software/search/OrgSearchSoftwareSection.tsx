// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import Button from '@mui/material/Button'

import useSmallScreen from '~/config/useSmallScreen'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getPageRange} from '~/utils/pagination'
import SearchInput from '~/components/search/SearchInput'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import FiltersModal from '~/components/filter/FiltersModal'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import OrgSoftwareFilters from '~/components/organisation/software/filters/index'

type SearchSectionProps = Readonly<{
  count: number
  rows: number
}>

export default function OrgSearchSoftwareSection({
  count, rows
}: SearchSectionProps) {
  const smallScreen = useSmallScreen()
  const {search,page,filterCnt,view} = useSoftwareParams()
  const {setPageLayout,setPageRows} = useUserSettings()
  const {handleQueryChange} = useQueryChange()
  const [modal, setModal] = useState(false)

  const placeholder = filterCnt > 0 ? 'Find within selection' : 'Find software'

  // console.group('OrgSearchSoftwareSection')
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
        {smallScreen === true &&
          <Button
            onClick={() => setModal(true)}
            variant="outlined"
          >
            Filters
          </Button>
        }
      </div>

      {smallScreen ?
        <FiltersModal
          open={modal}
          setModal={setModal}
        >
          <OrgSoftwareFilters />
        </FiltersModal>
        : undefined
      }

    </section>
  )
}
