// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationForOverview} from '../../types/Organisation'
import OrganisationCard from './OrganisationCard'
import FlexibleGridSection, {useAdvicedDimensions} from '../layout/FlexibleGridSection'
import NoContent from '../layout/NoContent'

// render organisation cards
export default function OrganisationsGrid({organisations}:
  { organisations: OrganisationForOverview[] }) {
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions('organisation')

  if (organisations.length === 0) {
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] p-[0.125rem] pt-4 pb-12"
      height={itemHeight}
      minWidth={minWidth}
      maxWidth={maxWidth}
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
