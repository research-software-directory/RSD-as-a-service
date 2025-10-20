// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
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
import UserOrganisationsOverview from './UserOrganisationsOverview'
import useUserOrganisations from './useUserOrganisations'

export default function UserOrganisations() {
  const searchParams = useSearchParams()
  const {handleQueryChange} = useHandleQueryChange()
  const {counts:{organisation_cnt}} = useUserContext()
  const {rsd_page_layout,rsd_page_rows,setPageLayout,setPageRows} = useUserSettings()
  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  // extract search params and assign defaults if not present
  const searchFor = searchParams?.get('search') ?? undefined
  const page = Number.parseInt(searchParams?.get('page') ?? '1')
  const {loading, organisations,count} = useUserOrganisations({
    searchFor,
    page: page ? page -1 : 0,
    rows:rsd_page_rows
  })
  // number of items to show in skeleton while loading
  const skeleton_items = rsd_page_rows < organisation_cnt ? rsd_page_rows : organisation_cnt ?? 3
  // number of pages for pagination at the bottom of the page
  const numPages = Math.ceil(count / rsd_page_rows)

  return (
    <div className="flex-1">
      {/* SEARCH */}
      <SearchPanel
        placeholder='Find organisation'
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

      {/* ORGANISATION ITEMS */}
      <UserOrganisationsOverview
        skeleton_items={skeleton_items}
        layout={view}
        loading={loading}
        organisations={organisations}
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
