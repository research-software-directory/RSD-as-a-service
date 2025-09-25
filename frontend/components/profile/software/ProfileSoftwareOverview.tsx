// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'

type ProfileSoftwareOverviewProps = Readonly<{
  software: SoftwareOverviewItemProps[]
}>

export default function ProfileSoftwareOverview({software}:ProfileSoftwareOverviewProps) {
  const {rsd_page_layout} = useUserSettings()

  if (!software || software.length === 0) {
    return <NoContent />
  }

  if (rsd_page_layout === 'list') {
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
