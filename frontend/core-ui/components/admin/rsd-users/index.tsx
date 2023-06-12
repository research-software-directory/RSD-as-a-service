// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'

import RsdUsersList from './RsdUsersList'

export default function RsdUsersPage() {
  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        <Pagination />
      </div>
      <RsdUsersList />
    </section>
  )
}
