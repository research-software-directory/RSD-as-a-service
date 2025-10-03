// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Link from 'next/link'

import {useUserSettings} from '~/config/UserSettingsContext'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'

import SoftwareOverviewList from './list/SoftwareOverviewList'
import SoftwareOverviewMasonry from './cards/SoftwareOverviewMasonry'
import SoftwareGridCard from './cards/SoftwareGridCard'
import SoftwareMasonryCard from './cards/SoftwareMasonryCard'
import SoftwareListItemContent from './list/SoftwareListItemContent'
import RsdHostBanner from './list/RsdHostBanner'
import OverviewListItem from './list/OverviewListItem'
import {getItemKey, getPageUrl, getRsdHost} from './useSoftwareOverviewProps'

type SoftwareOverviewContentProps = Readonly<{
  software: SoftwareOverviewItemProps[]
  hasRemotes?: boolean
}>

export default function SoftwareOverviewContent({software, hasRemotes}: SoftwareOverviewContentProps) {
  const {rsd_page_layout} = useUserSettings()

  if (!software || software.length === 0) {
    return <NoContent />
  }

  switch(rsd_page_layout){
    case 'masonry':
      // Masonry layout (software only)
      return (
        <SoftwareOverviewMasonry>
          {software.map((item) => {
            const cardKey = getItemKey({id:item.id,domain:item.domain})
            // remove rsd_host if remotes are not present
            item.rsd_host = getRsdHost({hasRemotes,rsd_host:item.rsd_host})
            return (
              <div key={cardKey} className="mb-8 break-inside-avoid">
                <SoftwareMasonryCard item={item}/>
              </div>
            )
          })}
        </SoftwareOverviewMasonry>
      )
    case 'list':
      return (
        <SoftwareOverviewList>
          {software.map(item => {
            const listKey = getItemKey({id:item.id,domain:item.domain})
            const pageUrl = getPageUrl({domain:item.domain,slug:item.slug})
            // remove rsd_host if remotes are not present
            item.rsd_host = getRsdHost({hasRemotes,rsd_host:item.rsd_host})
            return (
              <OverviewListItem
                key={listKey}
                className="pr-4">
                <Link
                  data-testid="software-list-item"
                  href={pageUrl}
                  className='flex-1 flex hover:text-inherit group'
                  title={item.brand_name}
                  target={item.domain ? '_blank' : '_self'}
                >
                  <SoftwareListItemContent
                    statusBanner={
                      <RsdHostBanner rsd_host={item?.rsd_host} domain={item?.domain}/>
                    }
                    {...item}
                  />
                </Link>
              </OverviewListItem>
            )
          })}
        </SoftwareOverviewList>
      )
    default:
      // GRID as default
      return (
        <GridOverview>
          {software.map((item) => {
            const cardKey = getItemKey({id:item.id,domain:item.domain})
            // remove rsd_host if remotes are not present
            item.rsd_host = getRsdHost({hasRemotes,rsd_host:item.rsd_host})

            return <SoftwareGridCard key={cardKey} {...item}/>
          })}
        </GridOverview>
      )
  }

}
