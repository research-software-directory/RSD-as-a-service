// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '../../../auth'
import {OrganisationForOverview} from '../../../types/Organisation'
import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import SoftwareGrid from '../../software/SoftwareGrid'
import GridScrim from '../../layout/GridScrim'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'

export default function OrganisationSoftware({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for software')
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    token: session.token
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  if (loading){
    return (
      <GridScrim
        rows={rows}
        height='17rem'
        minWidth='25rem'
        maxWidth='1fr'
        className="gap-[0.125rem] pt-2 pb-12"
      />
    )
  }

  return (
    <SoftwareGrid
      software={software}
      grid={{
        height:'17rem',
        minWidth:'25rem',
        maxWidth:'1fr'
      }}
      className="gap-[0.125rem] pt-2 pb-12"
    />
  )
}
