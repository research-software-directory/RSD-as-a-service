// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import StatusBanner from '~/components/communities/software/card/StatusBanner'
import useUserSoftwareActions from './useUserSoftwareActions'
import {UserSoftwareGridCard} from './UserSoftwareGridCard'


export default function UserSoftwareListItem({item}:UserSoftwareGridCard) {
  const {software,menuOptions,onAction} = useUserSoftwareActions({item})

  // console.group('UserSoftwareListItem')
  // console.log('software...', software)
  // console.log('is_published...', software.is_published)
  // console.log('menuOptions...', menuOptions)
  // console.groupEnd()

  return (
    <OverviewListItem>
      {/* standard software list item with link */}
      <OverviewListItemLink
        href={`/software/${software.slug}`}
      >
        <SoftwareListItemContent
          statusBanner={
            <StatusBanner
              status="approved"
              is_published={software.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...software}
        />
      </OverviewListItemLink>
      {/* admin menu */}
      <div className="flex mx-2">
        <div className="flex items-center gap-2 mx-1">

        </div>
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </div>
    </OverviewListItem>
  )
}
