// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationForOverview} from '~/types/Organisation'
import CardSkeleton from '~/components/cards/CardSkeleton'
import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import OrganisationCard from '~/components/organisation/overview/card/OrganisationCard'
import OrganisationListItem from './OrganisationListItem'

type UserOrganisationsOverviewProps=Readonly<{
  layout: ProjectLayoutType
  skeleton_items: number
  loading: boolean
  organisations: OrganisationForOverview[]
}>


export default function UserOrganisationsOverview({loading,skeleton_items,layout,organisations}:UserOrganisationsOverviewProps) {
  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={skeleton_items} fullWidth={true} />
  }

  if (organisations.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <div
        data-testid="organisation-overview-list"
        className="flex-1 my-2 flex flex-col gap-2">
        {organisations.map((item) => (
          <OrganisationListItem key={item.slug} organisation={item} />
        ))}
      </div>
    )
  }

  return (
    <section
      data-testid="organisation-overview-grid"
      className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[27rem]">
      {organisations.map((organisation) => (
        <OrganisationCard
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </section>
  )
}
