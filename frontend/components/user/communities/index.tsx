// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useSearchParams} from 'next/navigation'

import {getPageRange} from '~/utils/pagination'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import {useUserSettings} from '~/config/UserSettingsContext'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {useUserContext} from '~/components/user/context/UserContext'
import SearchPanel from '~/components/user/search/SearchPanel'
import useUserCommunities from './useUserCommunities'
import UserCommunitiesOverview from './UserCommunitiesOverview'

export default function UserCommunities() {
  const searchParams = useSearchParams()
  const {handleQueryChange} = useHandleQueryChange()
  const {rsd_page_layout,rsd_page_rows,setPageLayout,setPageRows} = useUserSettings()
  const {counts:{community_cnt}} = useUserContext()
  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  // extract search params and assign defaults if not present
  const searchFor = searchParams?.get('search') ?? undefined
  const page = Number.parseInt(searchParams?.get('page') ?? '1')
  const {loading,communities,count} = useUserCommunities({
    searchFor,
    page: page ? page -1 : 0,
    rows:rsd_page_rows
  })
  // number of items to show in skeleton while loading
  const skeleton_items = rsd_page_rows < community_cnt ? rsd_page_rows : community_cnt ?? 3
  // number of pages for pagination at the bottom of the page
  const numPages = Math.ceil(count / rsd_page_rows)

  // console.group('UserCommunities')
  // console.log('loading...', loading)
  // console.log('communities...', communities)
  // console.groupEnd()

  return (
    <div className="flex-1">
      {/* SEARCH */}
      <SearchPanel
        placeholder='Find community'
        layout={view}
        rows={rsd_page_rows}
        search={searchFor}
        onSearch={(search)=>handleQueryChange('search',search)}
        onSetView={setPageLayout}
        onSetRows={setPageRows}
      />
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          {getPageRange(rsd_page_rows, page, count)}
        </div>
      </div>

      {/* COMMUNITY ITEMS */}
      <UserCommunitiesOverview
        skeleton_items={skeleton_items}
        layout={view}
        loading={loading}
        communities={communities}
      />

      {/* Pagination */}
      <PaginationLinkApp
        count={numPages}
        page={page}
        className="py-6"
      />
    </div>
  )
}
