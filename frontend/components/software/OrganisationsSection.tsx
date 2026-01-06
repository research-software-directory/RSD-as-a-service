// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {styled} from '@mui/material/styles'
import {ParticipatingOrganisationProps} from '~/types/Organisation'
import PageContainer from '~/components/layout/PageContainer'
import ParticipatingOrganisation from './ParticipatingOrganisation'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const OrganisationGridSection = styled('section')(({theme}) => ({
  flex: 1,
  display: 'grid',
  gridGap: '2rem',
  gridAutoRows: 'minmax(3rem,5rem)',
  gridTemplateColumns: 'repeat(auto-fit,minmax(5rem,13rem))'
}))

export default function OrganisationsSection({organisations = []}: {organisations: ParticipatingOrganisationProps[]}) {
  // do not render section if no data
  if (organisations?.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr_4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary leading-10">
        Participating organisations
      </h2>
      <OrganisationGridSection>
        {organisations.map((item) => {
          return (
            <ParticipatingOrganisation
              key={item.rsd_path}
              {...item}
            />
          )
        })}
      </OrganisationGridSection>
    </PageContainer>
  )
}
