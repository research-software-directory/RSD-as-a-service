// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {useSession} from '~/auth'
import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import FlexibleGridSection, {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import SoftwareCard from '~/components/software/SoftwareCard'
import NoContent from '~/components/layout/NoContent'
import {OrganisationComponentsProps} from '../OrganisationNavItems'
import SoftwareCardWithMenu from './SoftwareCardWithMenu'
import ContentLoader from '~/components/layout/ContentLoader'
import UserAgrementModal from '~/components/user/UserAgreementModal'

export default function OrganisationSoftware({organisation, isMaintainer}: OrganisationComponentsProps) {
  const {token} = useSession()
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions('software')
  const {searchFor,page,rows,setCount} = usePaginationWithSearch(`Find software in ${organisation.name}`)
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    isMaintainer,
    token
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  // show loader
  if (loading===true) return <ContentLoader />

  if (software.length === 0
    && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] p-[0.125rem] pt-2 pb-12"
      height={itemHeight}
      minWidth={minWidth}
      maxWidth={maxWidth}
    >
      <UserAgrementModal />
      {software.map(item => {
        if (isMaintainer) {
          return(
            <SoftwareCardWithMenu
              key={item.id}
              organisation={organisation}
              item={item}
              token={token}
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
