// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Searchbox from '~/components/search/Searchbox'
import Pagination from '~/components/pagination/Pagination'

// SEARCH and pagination for software and project
export default function SearchAndPagination({title}:{title:string}) {

  return (
    <>
      <h2 className="py-4">{title}</h2>
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        <Pagination />
      </div>
    </>
  )
}
