// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import NoContent from '~/components/layout/NoContent'
import {LayoutOptions} from '~/components/cards/CardsLayoutOptions'
import SoftwareOverviewList from './list/SoftwareOverviewList'
import SoftwareOverviewMasonry from './cards/SoftwareOverviewMasonry'
import SoftwareOverviewGrid from './cards/SoftwareOverviewGrid'
import SoftwareGridCard from './cards/SoftwareGridCard'
import SoftwareMasonryCard from './cards/SoftwareMasonryCard'
import SoftwareListItemContent from './list/SoftwareListItemContent'
import OverviewListItem from './list/OverviewListItem'

type SoftwareOverviewContentProps = {
  layout: LayoutOptions
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
        {software.map((item) => (
          <div key={item.id} className="mb-8 break-inside-avoid">
            <SoftwareMasonryCard item={item}/>
          </div>
        ))}
      </SoftwareOverviewMasonry>
    )
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
              className='flex-1 hover:text-inherit'
              title={item.brand_name}
            >
              <OverviewListItem className="pr-4">
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
    <SoftwareOverviewGrid withImg={false}>
      {software.map((item) => (
        <SoftwareGridCard key={item.id} withImg={false} {...item}/>
      ))}
    </SoftwareOverviewGrid>
  )
}
