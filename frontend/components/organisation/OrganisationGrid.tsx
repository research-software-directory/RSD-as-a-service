// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationForOverview} from '../../types/Organisation'
import ContentInTheMiddle from '../layout/ContentInTheMiddle'
import OrganisationCard from './OrganisationCard'
import FlexibleGridSection from '../layout/FlexibleGridSection'

// render organisation cards
export default function OrganisationsGrid({organisations}:
  {organisations: OrganisationForOverview[]}) {

  if (organisations.length === 0) {
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
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
