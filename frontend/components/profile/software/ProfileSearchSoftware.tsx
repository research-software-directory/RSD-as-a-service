// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect} from 'react'

import {getPageRange} from '~/utils/pagination'
import ProfileSearchPanel from '~/components/profile/ProfileSearchPanel'
import {useUserSettings} from '~/config/UserSettingsContext'
import {useProfileContext} from '~/components/profile/context/ProfileContext'

export type ProfileSearch = Readonly<{
  count: number
  page: number
  rows: number
  search?: string|null
}>

export default function ProfileSearchSoftware({
  search,count,page,rows,
}: ProfileSearch) {
  const {rsd_page_layout} = useUserSettings()
  const {software_cnt,setSoftwareCnt} = useProfileContext()

  const placeholder = 'Find software'
  const layout = rsd_page_layout==='masonry' ? 'grid' : rsd_page_layout

  /**Sync most recent count with software count shown in the tab */
  useEffect(()=>{
    if (count!==software_cnt){
      setSoftwareCnt(count)
    }
  },[count,software_cnt,setSoftwareCnt])

  // console.group('ProfileSearchSoftware')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.log('count...', count)
  // console.groupEnd()

  return (
    <section data-testid="search-section">
      <ProfileSearchPanel
        placeholder={placeholder}
        view={layout}
        rows={rows}
        search={search}
      />
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          {getPageRange(rows, page, count)}
        </div>
      </div>
    </section>
  )
}
