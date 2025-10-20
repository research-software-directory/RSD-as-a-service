// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useUserSettings} from '~/config/UserSettingsContext'
import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import AdminCommunitiesClient from './AdminCommunitiesClient'

export default function AdminCommunities() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  const pagination = {
    ...defaultPagination,
    rows: rsd_page_rows ?? rowsPerPageOptions[0]
  }

  return (
    <SearchProvider>
      <PaginationProvider pagination={pagination}>
        <AdminCommunitiesClient />
      </PaginationProvider>
    </SearchProvider>
  )
}
