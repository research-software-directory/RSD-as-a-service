// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useUserSettings} from '~/config/UserSettingsContext'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import {CommunityListProps} from '../apiCommunities'
import CommunitiesList from './CommunitiesList'
import CommunitiesGrid from './CommunitiesGrid'

type CommunitiesOverviewProps = Readonly<{
  count: number,
  page: number,
  rows: number,
  communities: CommunityListProps[],
  search?: string|null,
}>

export default function CommunitiesOverview({
  communities = [], count, page, rows, search
}: CommunitiesOverviewProps) {
  const {handleQueryChange} = useHandleQueryChange()
  const {rsd_page_layout,setPageLayout,setPageRows} = useUserSettings()
  const numPages = Math.ceil(count / rows)

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  return (
    <>
      {/* Page title with search and pagination */}
      <div className="flex flex-wrap mt-4 py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
        <h1 className="mr-4 lg:flex-1">
          Communities
        </h1>
        <div className="flex-2 flex min-w-[20rem]">
          <SearchInput
            placeholder="Search community by name or short description"
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
      </div>

      {/* community cards, grid is default */}
      {view === 'list' ?
        <CommunitiesList items={communities} />
        :
        <CommunitiesGrid items={communities} />
      }

      {/* Pagination */}
      <PaginationLinkApp
        count={numPages}
        page={page}
      />
    </>
  )
}
