// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

import {getPageRange} from '~/utils/pagination'
import SearchInput from '~/components/search/SearchInput'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import ViewToggleGroup, {LayoutType} from './ViewToggleGroup'
import SelectRows from './SelectRows'

type SearchSectionProps = {
  page: number
  rows: number
  count: number
  placeholder: string
  layout: LayoutType
  search?: string | null
  setModal: (modal: boolean) => void
  setView: (view:LayoutType)=>void
}


export default function SoftwareSearchSection({
  search, placeholder, page, rows, count, layout,
  setView, setModal
}: SearchSectionProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()
  const smallScreen = useMediaQuery('(max-width:640px)')

  return (
    <section data-testid="search-section">
      <div className="flex border rounded-md shadow-sm bg-base-100 p-2">
        <SearchInput
          placeholder={placeholder}
          onSearch={(search: string) => handleQueryChange('search', search)}
          defaultValue={search ?? ''}
        />
        <ViewToggleGroup
          layout={layout}
          onSetView={setView}
        />
        <SelectRows
          rows={rows}
          handleQueryChange={handleQueryChange}
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
    </section>
  )
}
