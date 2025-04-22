// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import NoContent from '~/components/layout/NoContent'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import AdminSoftwareGridCard from './card/AdminSoftwareGridCard'
import useOrganisationContext from '../context/useOrganisationContext'
import {SoftwareOfOrganisation} from '~/types/Organisation'
import SoftwareGridCard from '~/components/software/overview/cards/SoftwareGridCard'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import SoftwareOverviewGrid from '~/components/software/overview/cards/SoftwareOverviewGrid'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import AdminSoftwareListItem from './list/AdminSoftwareListItem'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import CardSkeleton from '~/components/cards/CardSkeleton'

type OrganisationSoftwareOverviewProps = Readonly<{
  layout: ProjectLayoutType
  software: SoftwareOfOrganisation[]
  loading: boolean
  rows: number
}>

export default function OrganisationSoftwareOverview({layout,software,loading,rows}: OrganisationSoftwareOverviewProps) {
  const {isMaintainer, software_cnt} = useOrganisationContext()
  // max item to be set to rows
  let itemCnt = rows
  if (software_cnt && software_cnt < rows) itemCnt = software_cnt

  // console.group('OrganisationSoftwareOverview')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('software_cnt...', software_cnt)
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('layout...', layout)
  // console.groupEnd()

  if (loading) {
    return <CardSkeleton layout={layout} count={itemCnt} />
  }

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
