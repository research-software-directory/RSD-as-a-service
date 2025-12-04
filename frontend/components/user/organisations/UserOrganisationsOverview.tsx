// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationForOverview} from '~/types/Organisation'
import CardSkeleton from '~/components/cards/CardSkeleton'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
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
      <ListOverviewSection>
        {organisations.map((item) => (
          <OrganisationListItem key={item.slug} organisation={item} />
        ))}
      </ListOverviewSection>
    )
  }

  // GRID as default
  return (
    <GridOverview fullWidth={true}>
      {organisations.map((organisation) => (
        <OrganisationCard
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </GridOverview>
  )
}
