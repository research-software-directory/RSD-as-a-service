// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {SoftwareOfOrganisation} from '~/types/Organisation'
import {useUserSettings} from '~/config/UserSettingsContext'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
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
      <ListOverviewSection>
        {software.map(item => {
          if (isMaintainer) {
            return <AdminSoftwareListItem key={item.id} item={item} />
          }

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
