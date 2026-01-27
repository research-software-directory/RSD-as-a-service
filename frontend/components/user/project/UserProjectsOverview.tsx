// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import CardSkeleton from '~/components/cards/CardSkeleton'
import {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import {ProjectByMaintainer} from './useUserProjects'
import UserProjectGridCard from './UserProjectGridCard'
import UserProjectListItem from './UserProjectListItem'

type UserProjectsOverviewProps=Readonly<{
  layout: ProjectLayoutType
  skeleton_items: number
  loading: boolean
  projects: ProjectByMaintainer[]
}>

export default function UserProjectsOverview({loading,skeleton_items,layout,projects}:UserProjectsOverviewProps) {

  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={skeleton_items} fullWidth={true} />
  }

  if (projects.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <ListOverviewSection>
        {projects.map(item => {
          return <UserProjectListItem key={item.id} item={item} />
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
  // use software overview component for full width (4 items in row)
  return (
    <GridOverview fullWidth={true}>
      {projects.map((item) => {
        return <UserProjectGridCard key={item.id} item={item} />
      })}
    </GridOverview>
  )
}
