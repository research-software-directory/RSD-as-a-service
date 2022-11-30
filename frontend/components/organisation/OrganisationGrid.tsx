// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'

import {OrganisationForOverview} from '../../types/Organisation'
import OrganisationCard from './OrganisationCard'
import FlexibleGridSection from '../layout/FlexibleGridSection'
import NoContent from '../layout/NoContent'

// render organisation cards
export default function OrganisationsGrid({organisations}:
  { organisations: OrganisationForOverview[] }) {
  const theme = useTheme()
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery(theme.breakpoints.down('lg'))
  // adjust grid width and height for mobile
  const minWidth = smallScreen ? '17rem' : '26rem'
  const itemHeight = smallScreen ? '26rem' : '17rem'

  if (organisations.length === 0) {
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] p-[0.125rem] pt-4 pb-12"
      height={itemHeight}
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
