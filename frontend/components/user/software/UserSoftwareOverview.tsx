// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import NoContent from '~/components/layout/NoContent'
import CardSkeleton from '~/components/cards/CardSkeleton'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import {SoftwareByMaintainer} from './useUserSoftware'

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
      <SoftwareOverviewList>
        {software.map(item => {
          return (
            <Link
              data-testid="software-list-item"
              key={item.id}
              href={`/software/${item.slug}`}
              className='hover:text-inherit'
              title={item.brand_name}
            >
              <OverviewListItem className='pr-4'>
                <SoftwareListItemContent key={item.id} {...item} />
              </OverviewListItem>
            </Link>
          )
        })}
      </SoftwareOverviewList>
    )
  }

  // GRID as default
  return (
    <SoftwareOverviewGrid fullWidth={true}>
      {software.map((item) => {
        return <SoftwareGridCard key={item.id} {...item as any}/>
      })}
    </SoftwareOverviewGrid>
  )
}
