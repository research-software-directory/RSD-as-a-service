// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import GridScrim from '../../layout/GridScrim'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import {OrganisationPageProps} from 'pages/organisations/[...slug]'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'
import SoftwareCardWithMenu from './SoftwareCardWithMenu'
import SoftwareCard from '~/components/software/SoftwareCard'

export default function OrganisationSoftware({organisation, session, isMaintainer}:OrganisationPageProps) {
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

  if (software.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
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
            brand_name={item.brand_name}
            short_statement={item.short_statement ?? ''}
            is_featured={item?.is_featured ?? false}
            updated_at={item.updated_at ?? null}
            mention_cnt={item?.mention_cnt ?? null}
            contributor_cnt={item?.contributor_cnt ?? null}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
