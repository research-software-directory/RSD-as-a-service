// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useUserSettings} from '~/config/UserSettingsContext'
import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import Pagination from '~/components/pagination/Pagination'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import Searchbox from '~/components/search/Searchbox'
import {SearchProvider} from '~/components/search/SearchContext'
import AdminProjectsList from './AdminProjectsList'

export default function AdminProjects() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  const pagination = {
    ...defaultPagination,
    rows: rsd_page_rows ?? rowsPerPageOptions[0]
  }
  return (
    <SearchProvider>
      <PaginationProvider pagination={pagination}>
        <section className="flex-1">
          <div className="flex flex-wrap items-center justify-end">
            <Searchbox />
            <Pagination />
          </div>
          <div className="pt-4">
            <AdminProjectsList/>
          </div>
        </section>
      </PaginationProvider>
    </SearchProvider>
  )
}
