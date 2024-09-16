// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import ContributorsTable from './ContributorsTable'

export default function AdminRsdContributors() {

  return (
    <section className="flex-1 overflow-hidden">
      <div className="flex-1 flex py-8 md:py-0 flex-col xl:flex-row justify-center xl:items-center">
        <Searchbox />
        <Pagination />
      </div>
      <ContributorsTable />
    </section>
  )
}
