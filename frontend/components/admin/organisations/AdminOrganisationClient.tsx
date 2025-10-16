// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useSession} from '~/auth/AuthProvider'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import OrganisationsAdminList from './OrganisationsAdminList'
import AddOrganisation from './AddOrganisation'
import {useOrganisations} from './useOrganisations'

export default function AdminOrganisationsClient() {
  const {token} = useSession()
  const {organisations, loading, page, addOrganisation, removeOrganisation} = useOrganisations(token)

  // console.group('OrganisationAdminPage')
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-8">
      <div>
        <div className="flex flex-wrap items-center justify-end">
          <Searchbox />
          <Pagination />
        </div>
        <div className="pt-1">
          <OrganisationsAdminList
            page={page}
            loading={loading}
            organisations={organisations}
            onDeleteOrganisation={removeOrganisation}
          />
        </div>
      </div>
      <AddOrganisation onAddOrganisationToRsd={addOrganisation} />
    </section>
  )
}
