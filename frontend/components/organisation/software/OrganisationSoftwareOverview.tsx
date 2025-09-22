// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'

import {SoftwareOfOrganisation} from '~/types/Organisation'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import AdminSoftwareGridCard from './card/AdminSoftwareGridCard'
import AdminSoftwareListItem from './list/AdminSoftwareListItem'

type OrganisationSoftwareOverviewProps = Readonly<{
  software: SoftwareOfOrganisation[]
  isMaintainer: boolean
}>

export default function OrganisationSoftwareOverview({software,isMaintainer}: OrganisationSoftwareOverviewProps) {
  const {rsd_page_layout} = useUserSettings()

  // console.group('OrganisationSoftwareOverview')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('software...', software)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.groupEnd()

  if (!software || software.length === 0) {
    return <NoContent />
  }

  if (rsd_page_layout === 'list') {
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
