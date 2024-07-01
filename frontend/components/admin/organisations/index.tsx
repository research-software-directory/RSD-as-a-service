// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import OrganisationsAdminList from './OrganisationsAdminList'
import AddOrganisation from './AddOrganisation'
import {useOrganisations} from './apiOrganisation'

export default function OrganisationsAdminPage() {
  const {token} = useSession()
  const {organisations, loading, page, addOrganisation, removeOrganisation} = useOrganisations(token)

  // console.group('OrganisationAdminPage')
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-8">
      <div>
        <div className="flex flex-wrap items-center justify-end">
          <Searchbox />
          <Pagination />
        </div>
        <OrganisationsAdminList
          page={page}
          loading={loading}
          organisations={organisations}
          onDeleteOrganisation={removeOrganisation}
        />
      </div>
      <AddOrganisation onAddOrganisationToRsd={addOrganisation} />
    </section>
  )
}
