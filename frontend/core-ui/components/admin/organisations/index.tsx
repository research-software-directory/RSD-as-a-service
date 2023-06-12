// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import PaginationContext from '~/components/pagination/PaginationContext'
import OrganisationsAdminList from './OrganisationsAdminList'
import AddOrganisation from './AddOrganisation'
import {useSession} from '~/auth'
import {useOrganisations} from './apiOrganisation'

export default function OrganisationAdminPage() {
  const {token} = useSession()
  const {pagination:{count}} = useContext(PaginationContext)
  const {organisations, loading, addOrganisation, removeOrganisation} = useOrganisations(token)

  // console.group('OrganisationAdminPage')
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-8">
      <div>
        <h2 className="flex pr-4 pb-4 justify-between">
          <span>RSD organisations</span>
          <span>{count}</span>
        </h2>
        <div className="flex flex-wrap items-center justify-end">
          <Searchbox />
          <Pagination />
        </div>
        <OrganisationsAdminList
          loading={loading}
          organisations={organisations}
          onDeleteOrganisation={removeOrganisation}
        />
      </div>
      <AddOrganisation onAddOrganisationToRsd={addOrganisation} />
    </section>
  )
}
