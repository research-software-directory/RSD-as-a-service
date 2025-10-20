// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import {useUserSettings} from '~/config/UserSettingsContext'
import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import {SearchProvider} from '~/components/search/SearchContext'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import RsdInfoTable from './RsdInfoTable'

export default function AdminRsdInfo() {
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
          <RsdInfoTable />
        </section>
      </PaginationProvider>
    </SearchProvider>
  )
}
