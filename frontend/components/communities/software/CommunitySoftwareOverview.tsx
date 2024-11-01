// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {useCommunityContext} from '~/components/communities/context'
import AdminSoftwareGridCard from './card/AdminSoftwareGridCard'
import AdminSoftwareListItem from './list/AdminSoftwareListItem'
import {SoftwareOfCommunity} from './apiCommunitySoftware'

type CommunitySoftwareOverviewProps = Readonly<{
  layout: ProjectLayoutType
  software: SoftwareOfCommunity[]
}>

export default function CommunitySoftwareOverview({layout,software}: CommunitySoftwareOverviewProps) {
  const {isMaintainer} = useCommunityContext()

  // console.group('CommunitySoftwareOverview')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('software_cnt...', software_cnt)
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('layout...', layout)
  // console.groupEnd()

  if (!software || software.length === 0) {
    return <NoContent />
  }

  if (layout === 'list') {
    return (
      <SoftwareOverviewList>
        {software.map(item => {
          if (isMaintainer) {
            return <AdminSoftwareListItem key={item.id} item={item} />
          }

          return (
            <Link
              data-testid="software-list-item"
              key={item.id}
              href={`/software/${item.slug}`}
              className='flex-1 hover:text-inherit'
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
    <SoftwareOverviewGrid>
      {software.map((item) => {
        if (isMaintainer) {
          return (
            <AdminSoftwareGridCard key={item.id} item={item} />
          )
        }
        return <SoftwareGridCard key={item.id} {...item}/>
      })}
    </SoftwareOverviewGrid>
  )

}
