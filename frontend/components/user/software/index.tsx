// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import SoftwareOverviewList from '~/components/software/overview/list/SoftwareOverviewList'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import useUserSoftware from './useUserSoftware'

export default function UserSoftware() {
  const {loading, software} = useUserSoftware()

  // console.group('UserSoftware')
  // console.log('loading...', loading)
  // console.log('software...', software)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  if (software.length === 0) {
    return <NoContent />
  }

  return (
    <div>
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
        })
        }
      </SoftwareOverviewList>
    </div>
  )

}
