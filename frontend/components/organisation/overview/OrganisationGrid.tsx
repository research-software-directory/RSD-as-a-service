// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import OrganisationCard, {OrganisationCardProps} from './card/OrganisationCard'

export type OrganisationGridProps = {
  organisations: OrganisationCardProps[]
}

export default function OrganisationGrid({organisations}: OrganisationGridProps) {

  if (typeof organisations == 'undefined' || organisations.length===0){
    return <NoContent />
  }

  return (
    <GridOverview fullWidth={true} className="pt-12 pb-6 auto-rows-[28rem]">
      {organisations.map((organisation) => (
        <OrganisationCard
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </GridOverview>
  )

}
