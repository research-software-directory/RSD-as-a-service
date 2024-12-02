// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import NoContent from '~/components/layout/NoContent'
import SourceRsd from '~/components/cards/SourceRsd'
import {LayoutType} from './search/ViewToggleGroup'
import SoftwareOverviewList from './list/SoftwareOverviewList'
import SoftwareOverviewMasonry from './cards/SoftwareOverviewMasonry'
import SoftwareOverviewGrid from './cards/SoftwareOverviewGrid'
import SoftwareGridCard from './cards/SoftwareGridCard'
import SoftwareMasonryCard from './cards/SoftwareMasonryCard'
import SoftwareListItemContent from './list/SoftwareListItemContent'
import OverviewListItem from './list/OverviewListItem'
import {getItemKey, getPageUrl} from './useSoftwareOverviewProps'

type SoftwareOverviewContentProps = {
  layout: LayoutType
  software: SoftwareOverviewItemProps[]
}

export default function SoftwareOverviewContent({layout, software}: SoftwareOverviewContentProps) {

  if (!software || software.length === 0) {
    return <NoContent />
  }

  if (layout === 'masonry') {
    // Masonry layout (software only)
    return (
      <SoftwareOverviewMasonry>
        {software.map((item) => {
          const cardKey = getItemKey({id:item.id,domain:item.domain})
          return (
            <div key={cardKey} className="mb-8 break-inside-avoid">
              <SoftwareMasonryCard item={item}/>
            </div>
          )
        })}
      </SoftwareOverviewMasonry>
    )
  }

  if (layout === 'list') {
    return (
      <SoftwareOverviewList>
        {software.map(item => {
          const listKey = getItemKey({id:item.id,domain:item.domain})
          const pageUrl = getPageUrl({domain:item.domain,slug:item.slug})
          return (
            <Link
              data-testid="software-list-item"
              key={listKey}
              href={pageUrl}
              className='flex-1 hover:text-inherit'
              title={item.brand_name}
              target={item.domain ? '_blank' : '_self'}
            >
              <OverviewListItem className="pr-4 relative">
                <SoftwareListItemContent
                  statusBanner={
                    <div style={{
                      position:'absolute',
                      top:'0.125rem',
                      right: '1rem'
                    }}>
                      <SourceRsd source={item?.source} domain={item?.domain}/>
                    </div>
                  }
                  {...item}
                />
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
        const cardKey = getItemKey({id:item.id,domain:item.domain})
        return <SoftwareGridCard key={cardKey} {...item}/>
      })}
    </SoftwareOverviewGrid>
  )
}
