// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import FlexibleGridSection, {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import {OrganisationComponentsProps} from '../OrganisationNavItems'

import SearchAndPagination from '../SearchAndPagination'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'
import OrganisationSoftwareCards from './OrganisationSoftwareCards'

export default function OrganisationSoftware({organisation, isMaintainer}: OrganisationComponentsProps) {
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions('software')
  const {searchFor,page,rows,setCount} = usePaginationWithSearch(`Find software in ${organisation.name}`)

  return (
    <>
      <SearchAndPagination title="Software" />
      {/* Only when maintainer */}
      {isMaintainer && <UserAgrementModal />}
      {/* Software grid */}
      <FlexibleGridSection
        height={itemHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        className="gap-[0.125rem] p-[0.125rem] pt-2 pb-12"
      >
        <OrganisationSoftwareCards
          organisation={organisation}
          setCount={setCount}
          searchFor={searchFor}
          page={page}
          rows={rows}
          isMaintainer={isMaintainer}
        />
      </FlexibleGridSection>
    </>
  )
}
