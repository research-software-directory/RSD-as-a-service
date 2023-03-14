// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import {useSession} from '~/auth'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import PaginationContext from '~/components/pagination/PaginationContext'
import {useSoftwareHighlights} from './apiSoftwareHighlights'
import AddSoftwareHighlights from './AddSoftwareHighlights'
import SoftwareHighlightsList from './SoftwareHighlightsList'

export default function AdminSoftwareHighlight() {
  const {token} = useSession()
  const {pagination:{count}} = useContext(PaginationContext)
  const {highlights, loading, addHighlight, deleteHighlight} = useSoftwareHighlights(token)

  // console.group('OrganisationAdminPage')
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-8">
      <div>
        <h2 className="flex pr-4 pb-4 justify-between">
          <span>Defined software highlights</span>
          <span>{count}</span>
        </h2>
        <div className="flex flex-wrap items-center justify-end">
          <Searchbox />
          <Pagination />
        </div>
        <SoftwareHighlightsList
          highlights={highlights}
          loading={loading}
          onDeleteHighlight={deleteHighlight}
        />
      </div>
      <AddSoftwareHighlights
        onAddSoftware={addHighlight}
      />
    </section>
  )
}
