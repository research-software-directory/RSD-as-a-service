// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {Session} from '~/auth'
import OrganisationGrid from '~/components/organisation/OrganisationGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserOrganisations from './useUserOrganisations'

export default function UserOrganisations({session}: { session: Session }) {
  const {
    searchFor,
    page,
    rows,
    setCount
  } = usePaginationWithSearch('Search for organisation')
  const {loading, organisations, count} = useUserOrganisations({
    searchFor,
    page,
    rows,
    session
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // do not use loader for now
  // because the layout jumps up-and-down
  // on pagination
  // if (loading) {
  //   return (
  //     <ContentLoader />
  //   )
  // }

  return (
    <OrganisationGrid
      organisations={organisations}
    />
  )
}
