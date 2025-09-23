// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import AdminSoftwareGridCard from './card/AdminSoftwareGridCard'
import AdminSoftwareListItem from './list/AdminSoftwareListItem'
import {SoftwareOfCommunity} from './apiCommunitySoftware'

type CommunitySoftwareOverviewProps = Readonly<{
  software: SoftwareOfCommunity[]
  isMaintainer: boolean
}>

export default function CommunitySoftwareOverview({software,isMaintainer}: CommunitySoftwareOverviewProps) {
  const {rsd_page_layout} = useUserSettings()

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

  if (rsd_page_layout === 'list') {
    return (
      <ListOverviewSection>
        {software.map(item => {
          if (isMaintainer) {
            return <AdminSoftwareListItem key={item.id} item={item} />
          }

          return (
            <OverviewListItem key={item.id}>
              <OverviewListItemLink
                href={`/software/${item.slug}`}
              >
                <SoftwareListItemContent key={item.id} {...item} />
              </OverviewListItemLink>
            </OverviewListItem>
          )
        })}
      </ListOverviewSection>
    )
  }

  // GRID as default
  return (
    <GridOverview>
      {software.map((item) => {
        if (isMaintainer) {
          return (
            <AdminSoftwareGridCard key={item.id} item={item} />
          )
        }
        return <SoftwareGridCard key={item.id} {...item}/>
      })}
    </GridOverview>
  )

}
