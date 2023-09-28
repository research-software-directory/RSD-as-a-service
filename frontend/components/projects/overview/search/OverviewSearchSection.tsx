// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

import SearchInput from '~/components/search/SearchInput'
import SelectRows from '~/components/software/overview/search/SelectRows'
import CardsLayoutOptions, {LayoutOptions} from '~/components/cards/CardsLayoutOptions'

type SearchSectionProps = {
  page: number
  rows: number
  count: number
  placeholder: string
  layout: LayoutOptions
  search?: string | null
  setModal: (modal: boolean) => void
  setView: (view:LayoutOptions)=>void
  handleQueryChange: (key:string, value: string|string[])=>void
}


export default function OverviewSearchSection({
  search, placeholder, page, rows, count, layout,
  setView, setModal, handleQueryChange
}: SearchSectionProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')

  return (
    <section data-testid="search-section">
      <div className="flex border rounded-md shadow-sm bg-base-100 p-2">
        <SearchInput
          placeholder={placeholder}
          onSearch={(search: string) => handleQueryChange('search', search)}
          defaultValue={search ?? ''}
        />
        <CardsLayoutOptions
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
          Page {page ?? 1} of {count} results
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
