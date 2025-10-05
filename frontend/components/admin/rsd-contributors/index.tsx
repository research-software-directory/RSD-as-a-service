// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'
import Pagination from '~/components/pagination/Pagination'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import Searchbox from '~/components/search/Searchbox'
import {SearchProvider} from '~/components/search/SearchContext'
import ContributorsTable from './ContributorsTable'

export default function AdminRsdContributors() {
  // use page rows from user settings
  const {rsd_page_rows} = useUserSettings()
  const pagination = {
    ...defaultPagination,
    rows: rsd_page_rows ?? rowsPerPageOptions[0]
  }

  return (
    <SearchProvider>
      <PaginationProvider pagination={pagination}>
        <section className="flex-1 overflow-hidden">
          <div className="flex-1 flex py-8 md:py-0 flex-col xl:flex-row justify-center xl:items-center">
            <Searchbox />
            <Pagination />
          </div>
          <ContributorsTable />
        </section>
      </PaginationProvider>
    </SearchProvider>
  )
}
