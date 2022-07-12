// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'

import {OrganisationForOverview} from '../../types/Organisation'
import OrganisationCard from './OrganisationCard'
import FlexibleGridSection from '../layout/FlexibleGridSection'
import NoContent from '../layout/NoContent'

// render organisation cards
export default function OrganisationsGrid({organisations}:
  { organisations: OrganisationForOverview[] }) {
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile
  const minWidth = smallScreen ? '18rem' : '26rem'

  if (organisations.length === 0) {
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] p-[0.125rem] pt-4 pb-12"
      height='17rem'
      minWidth={minWidth}
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
