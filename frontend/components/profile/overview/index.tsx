// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import StatusForReaders from '~/components/a11y/StatusForReaders'
import {useUserSettings} from '~/config/UserSettingsContext'
import SearchInput from '~/components/search/SearchInput'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import {searchOverviewMsg} from '~/components/search/searchOverviewMsg'
import {PersonsOverview} from './apiPersonsOverview'
import PersonsList from './PersonsList'
import PersonsGrid from './PersonsGrid'

type PersonsOverviewProps = Readonly<{
  page: number,
  count: number,
  rows: number,
  persons: PersonsOverview[],
  search?: string|null,
}>

export default function PersonsOverviewClient({count,page,rows,search,persons}:PersonsOverviewProps) {
  const {handleQueryChange} = useHandleQueryChange()
  const {rsd_page_layout,setPageLayout,setPageRows} = useUserSettings()
  const numPages = Math.ceil(count / rows)

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  const {announcement} = searchOverviewMsg({
    name: 'organisations',
    count,
    page,
    rows,
    filterCnt:0,
    search
  })

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap mt-4 py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
        <h1 className="mr-4 lg:flex-1">
          Persons
        </h1>
        <div className="flex-2 flex">
          {/* a11y screen reader announcer */}
          <StatusForReaders message={announcement} />
          <SearchInput
            placeholder="Search person by name or affiliation"
            onSearch={(search: string) => handleQueryChange('search', search)}
            defaultValue={search ?? undefined}
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
      </div>
      {/* Page body */}
      {view === 'list' ?
        <PersonsList items={persons}/>
        :
        <PersonsGrid items={persons}/>
      }
      {/* Pagination */}
      <PaginationLinkApp
        count={numPages}
        page={page}
      />
    </>
  )
}
