// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import AdminProjectsList from './AdminProjectsList'

export default function AdminProjects() {
  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        <Pagination />
      </div>
      <div className="pt-4">
        <AdminProjectsList/>
      </div>
    </section>
  )
}
