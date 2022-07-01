// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {PageTitleSticky} from '~/components/layout/PageTitle'
import Searchbox from '../../components/search/Searchbox'
import Pagination from '../../components/pagination/Pagination'

export default function UserTitle({title, showSearch=false}:
  { title: string, showSearch?:boolean}) {

  function renderSearch() {
    if (showSearch===true) {
      return (
        <>
          <Searchbox />
          <Pagination />
        </>
      )
    }
    return null
  }

  return (
    <PageTitleSticky
      style={{padding:'1rem 0rem 2rem 0rem'}}
    >
      <div className="flex-1">
        <h1 className="flex-1 w-full md:mt-4">{title}</h1>
        {/* <div className='w-full'>
          <Breadcrumbs
            segments={createSegments(slug)}
          />
        </div> */}
      </div>
      <div className="xl:flex xl:items-center text-center">
        {renderSearch()}
      </div>
    </PageTitleSticky>
  )
}
