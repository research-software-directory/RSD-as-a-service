// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

import {getPageRange} from '~/utils/pagination'
import SearchInput from '~/components/search/SearchInput'
import SelectRows from '~/components/software/overview/search/SelectRows'
import FiltersModal from '~/components/filter/FiltersModal'
import ViewToggleGroup, {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import OrgProjectFilters from '~/components/organisation/projects/filters/index'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import useProjectParams from '~/components/organisation/projects/useProjectParams'

type SearchSectionProps = {
  count: number
  layout: ProjectLayoutType
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

      {smallScreen ?
        <FiltersModal
          open={modal}
          setModal={setModal}
        >
          <OrgProjectFilters />
        </FiltersModal>
        : undefined
      }

    </section>
  )
}
