// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

import SearchInput from '~/components/search/SearchInput'
import SelectRows from '~/components/software/overview/search/SelectRows'
import ViewToggleGroup, {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import useQueryChange from '../useQueryChange'
import {useState} from 'react'
import OrgProjectFiltersModal from '../filters/OrgProjectFiltersModal'
import useProjectParams from '../useProjectParams'
import {getPageRange} from '~/utils/pagination'

type SearchSectionProps = {
  // search?: string | null
  // page: number
  // rows: number
  count: number
  // placeholder: string
  layout: ProjectLayoutType
  // setModal: (modal: boolean) => void
  setView: (view:ProjectLayoutType)=>void
}


export default function OrganisationSearchProjectSection({
  count, layout, setView
}: SearchSectionProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {search,page,rows,filterCnt} = useProjectParams()
  const {handleQueryChange} = useQueryChange()
  const [modal, setModal] = useState(false)

  const placeholder = filterCnt > 0 ? 'Find within selection' : 'Find project'

  // console.group('OrganisationProjectSearchSection')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.groupEnd()

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

      {
        smallScreen === true &&
        <OrgProjectFiltersModal
          open={modal}
          setModal={setModal}
        />
      }

    </section>
  )
}
