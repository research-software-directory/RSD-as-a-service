// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'

import {OrganisationListProps} from '~/types/Organisation'
import OrganisationListItem from '~/components/user/organisations/OrganisationListItem'

export default function OrganisationList({organisations}:Readonly<{organisations: OrganisationListProps[]}>) {
  if (typeof organisations == 'undefined' || organisations.length===0){
    return <NoContent />
  }
  return (
    <section
      data-testid="organisation-overview-list"
      className="flex-1 my-12 flex flex-col gap-2">
      {organisations.map((item) => (
        <OrganisationListItem key={item.rsd_path} organisation={item} />
      ))}
    </section>
  )
}
