// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Pagination from '@mui/material/Pagination'

import {getPageRange} from '~/utils/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'
import {useUserContext} from '~/components/user/context/UserContext'
import SearchPanel from '~/components/user/search/SearchPanel'
import useUserCommunities from './useUserCommunities'
import UserCommunitiesOverview from './UserCommunitiesOverview'

export default function UserCommunities() {
  const {rsd_page_layout,rsd_page_rows,setPageLayout,setPageRows} = useUserSettings()
  const {counts:{community_cnt}} = useUserContext()
  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  const [searchFor, setSearchFor] = useState<string>()
  const [page, setPage] = useState<number>(0)
  const {loading,communities,count} = useUserCommunities({
    searchFor,
    page,
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
        placeholder='Find software'
        layout={view}
        rows={rsd_page_rows}
        search={searchFor ?? null}
        onSearch={setSearchFor}
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
      {numPages > 1 &&
          <div className="flex flex-wrap justify-center mt-8">
            <Pagination
              count={numPages}
              page={page + 1}
              onChange={(_, page) => {
                // handleQueryChange('page',page.toString())
                setPage(page-1)
              }}
            />
          </div>
      }
    </div>
  )
}
