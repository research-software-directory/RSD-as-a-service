// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import RsdInfoTable from './RsdInfoTable'

export default function RsdInfoPage() {

  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        <Pagination />
      </div>
      <RsdInfoTable />
    </section>
  )
}
