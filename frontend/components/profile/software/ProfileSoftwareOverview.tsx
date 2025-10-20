// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'

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
      <ListOverviewSection>
        {software.map(item => {
          return (
            <OverviewListItem key={item.id} className='pr-4'>
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
    <GridOverview fullWidth={true}>
      {software.map((item) => {
        return <SoftwareGridCard key={item.id} {...item}/>
      })}
    </GridOverview>
  )

}
