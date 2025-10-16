// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import {SearchProvider} from '~/components/search/SearchContext'
import MentionsOverview from './MentionsOverview'

export default function AdminMentions() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  const pagination = {
    ...defaultPagination,
    rows: rsd_page_rows ?? rowsPerPageOptions[0]
  }

  // console.group('OrganisationAdminPage')
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <SearchProvider>
      <PaginationProvider pagination={pagination}>
        <MentionsOverview />
      </PaginationProvider>
    </SearchProvider>
  )
}
