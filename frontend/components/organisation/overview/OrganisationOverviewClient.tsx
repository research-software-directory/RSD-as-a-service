// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useUserSettings} from '~/config/UserSettingsContext'
import {OrganisationListProps} from '~/types/Organisation'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import OrganisationListView from '~/components/organisation/overview/OrganisationList'
import OrganisationGrid from '~/components/organisation/overview/OrganisationGrid'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'

type OrganisationsOverviewProps = Readonly<{
  count: number,
  page: number,
  rows: number,
  organisations: OrganisationListProps[],
  search?: string|null,
}>

export default function OrganisationsOverviewClient({
  organisations = [], count, page, rows, search
}: OrganisationsOverviewProps) {

  const {handleQueryChange} = useHandleQueryChange()
  const {rsd_page_layout,setPageLayout,setPageRows} = useUserSettings()
  const numPages = Math.ceil(count / rows)

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  return (
    <>
      <div className="flex flex-wrap mt-4 py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
        <h1 className="mr-4 lg:flex-1">
          Organisations
        </h1>
        <div className="flex-2 flex min-w-[20rem]">
          <SearchInput
            placeholder="Search organisation by name, ROR name or website"
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
      {/* Organizations cards */}
      {view === 'list' ?
        <OrganisationListView organisations={organisations}/>
        :
        <OrganisationGrid organisations={organisations}/>
      }
      {/* Pagination */}
      <PaginationLinkApp
        count={numPages}
        page={page}
      />
    </>
  )
}
