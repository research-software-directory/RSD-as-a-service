// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import OrganisationCard, {OrganisationCardProps} from './card/OrganisationCard'

export type OrganisationGridProps = {
  organisations: OrganisationCardProps[]
}

export default function OrganisationGrid({organisations}: OrganisationGridProps) {

  if (typeof organisations == 'undefined' || organisations.length===0){
    return <NoContent />
  }

  return (
    <section
      data-testid="organisation-overview-grid"
      className="my-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[27rem]">
      {organisations.map((organisation) => (
        <OrganisationCard
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </section>
  )
}
