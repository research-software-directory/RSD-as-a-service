// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'
import NoContent from '~/components/layout/NoContent'
import OrganisationCard from '~/components/organisation/OrganisationCard'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserOrganisations from './useUserOrganisations'

export default function UserOrganisations({session}: { session: Session }) {
  const {
    searchFor,
    page,
    rows,
    setCount
  } = usePaginationWithSearch('Filter organisations')
  const {loading, organisations, count} = useUserOrganisations({
    searchFor,
    page,
    rows,
    session
  })

  // console.group('UserOrganisations')
  // console.log('loading...', loading)
  // console.log('organisations...', organisations)
  // console.log('searchFor...', searchFor)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.groupEnd()

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  if (organisations.length === 0) {
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] pt-4 pb-12"
      height='17rem'
      minWidth='26rem'
      maxWidth='1fr'
    >
      {organisations.map(item=>{
        return(
          <OrganisationCard
            key={item.slug}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
