// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Searchbox from '~/components/search/Searchbox'
import Pagination from '~/components/pagination/Pagination'

// SEARCH and pagination for software and project
export default function SearchAndPagination({title}:{title:string}) {

  return (
    <div className="xl:flex xl:items-center xl:gap-4 text-left pt-2">
      <h2>{title}</h2>
      <div className="flex-1 flex flex-wrap items-center justify-end">
        <Searchbox />
        <Pagination />
      </div>
    </div>
  )
}
