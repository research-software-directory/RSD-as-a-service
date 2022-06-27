// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import {OrganisationPageProps} from 'pages/organisations/[...slug]'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'
import SoftwareCardWithMenu from './SoftwareCardWithMenu'
import SoftwareCard from '~/components/software/SoftwareCard'
import NoContent from '~/components/layout/NoContent'

export default function OrganisationSoftware({organisation, session, isMaintainer}: OrganisationPageProps) {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for software')
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    isMaintainer,
    token: session.token
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  if (software.length === 0
    && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] pt-2 pb-12"
      height='17rem'
      minWidth='25rem'
      maxWidth='1fr'
    >
      {software.map(item => {
        if (isMaintainer) {
          return(
            <SoftwareCardWithMenu
              key={item.id}
              organisation={organisation}
              item={item}
              token={session.token}
            />
          )
        }
        return(
          <SoftwareCard
            key={`/software/${item.slug}/`}
            href={`/software/${item.slug}/`}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
