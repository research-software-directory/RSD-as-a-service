// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import CardSkeleton from '~/components/cards/CardSkeleton'
import {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import CommunityCard from '~/components/communities/overview/CommunityCard'
import CommunityListItem from '~/components/communities/overview/CommunityListItem'
import GridOverview from '~/components/layout/GridOverview'

type UserCommunitiesOverviewProps=Readonly<{
  layout: ProjectLayoutType
  skeleton_items: number
  loading: boolean
  communities: CommunityListProps[]
}>

export default function UserCommunitiesOverview({loading,skeleton_items,layout,communities}:UserCommunitiesOverviewProps) {
  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={skeleton_items} fullWidth={true} />
  }

  if (communities.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <div
        data-testid="communities-overview-list"
        className="flex-1 mt-4 flex flex-col gap-2">
        {communities.map((item) => (
          <CommunityListItem key={item.slug} community={item} />
        ))}
      </div>
    )
  }

  // GRID as default
  return (
    <GridOverview fullWidth={true}>
      {communities.map((item) => (
        <CommunityCard key={item.slug} community={item} />
      ))}
    </GridOverview>
  )
}
