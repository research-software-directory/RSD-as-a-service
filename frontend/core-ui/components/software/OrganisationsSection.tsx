// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@mui/system/styled'
import {ParticipatingOrganisationProps} from '../../types/Organisation'
import PageContainer from '../layout/PageContainer'
import ParticipatingOrganisation from './ParticipatingOrganisation'

const OrganisationGridSection = styled('section')(({theme}) => ({
  flex: 1,
  display: 'grid',
  gridGap: '2rem',
  gridAutoRows: 'minmax(3rem,5rem)',
  gridTemplateColumns: 'repeat(auto-fit,minmax(5rem,13rem))'
}))

export default function OrganisationsSection({organisations = []}: { organisations: ParticipatingOrganisationProps[] }) {
  // do not render section if no data
  if (organisations?.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary leading-10">
        Participating organisations
      </h2>
      <OrganisationGridSection>
        {organisations.map((item, pos) => {
          return (
            <ParticipatingOrganisation
              key={pos}
              {...item}
            />
          )
        })}
      </OrganisationGridSection>
    </PageContainer>
  )
}
