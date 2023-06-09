// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import OrganisationCard, {OrganisationCardProps} from './OrganisationCard'

export type OrganisationGridProps = {
  organisations: OrganisationCardProps[]
}

export default function OrganisationGrid({organisations}: OrganisationGridProps) {

  if (typeof organisations == 'undefined' || organisations.length===0){
    return <NoContent />
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-12">
      {organisations.map((organisation) => (
        <OrganisationCard
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </div>
  )
}
