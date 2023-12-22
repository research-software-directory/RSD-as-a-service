// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'

type ProfileSoftwareOverviewProps = {
  layout: ProjectLayoutType
  software: SoftwareOverviewItemProps[]
}

export default function ProfileSoftwareOverview({layout,software}:ProfileSoftwareOverviewProps) {

  if (!software || software.length === 0) {
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
    <SoftwareOverviewGrid fullWidth={true}>
      {software.map((item) => {
        return <SoftwareGridCard key={item.id} {...item}/>
      })}
    </SoftwareOverviewGrid>
  )

}
