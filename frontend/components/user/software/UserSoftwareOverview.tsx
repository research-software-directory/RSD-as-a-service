// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import CardSkeleton from '~/components/cards/CardSkeleton'
import {ProjectLayoutType} from '~/components/search/ToggleViewGroup'
import UserSoftwareGridCard from './UserSoftwareGridCard'
import {SoftwareByMaintainer} from './useUserSoftware'
import UserSoftwareListItem from './UserSoftwareListItem'

type UserSoftwareOverviewProps=Readonly<{
  layout: ProjectLayoutType
  skeleton_items: number
  loading: boolean
  software: SoftwareByMaintainer[]
}>

export default function UserSoftwareOverview({loading,skeleton_items,layout,software}:UserSoftwareOverviewProps) {

  // console.group('UserSoftwareOverview')
  // console.log('loading...', loading)
  // console.log('layout...', layout)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('page_rows...', page_rows)
  // console.log('software...', software)
  // console.groupEnd()

  // if loading show skeleton loader
  if (loading) {
    return <CardSkeleton layout={layout} count={skeleton_items} fullWidth={true} />
  }

  if (software.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <ListOverviewSection>
        {software.map(item => {
          return <UserSoftwareListItem key={item.id} item={item}/>
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
  return (
    <GridOverview fullWidth={true}>
      {software.map((item) => {
        return <UserSoftwareGridCard key={item.id} item={item} />
      })}
    </GridOverview>
  )
}
