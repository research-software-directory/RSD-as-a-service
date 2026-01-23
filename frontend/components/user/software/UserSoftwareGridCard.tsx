// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import StatusBanner from '~/components/cards/StatusBanner'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import SoftwareCardContent from '~/components/software/overview/cards/SoftwareCardContent'
import {SoftwareByMaintainer} from './useUserSoftware'
import useUserSoftwareActions from './useUserSoftwareActions'

export type UserSoftwareGridCard = Readonly<{
  item: SoftwareByMaintainer
}>


export default function UserSoftwareGridCard({item}:UserSoftwareGridCard) {
  const {software,menuOptions,onAction} = useUserSoftwareActions({item})

  // console.group('UserSoftwareGridCard')
  // console.log('software...', software)
  // console.log('is_published...', software.is_published)
  // console.log('menuOptions...', menuOptions)
  // console.groupEnd()

  return (
    <div
      data-testid="user-software-grid-card"
      className="relative h-full"
    >
      {/* standard software card with link */}
      <Link
        data-testid="software-grid-card"
        href={`/software/${software.slug}`}
        className="h-full hover:text-inherit"
      >
        <SoftwareCardContent
          visibleKeywords={3}
          visibleProgLang={3}
          {...software}
        />
      </Link>

      {/* menu and status icons - at the top of the card */}
      <div className="w-full flex items-center absolute top-0 pt-2 pr-2 opacity-50 hover:opacity-100 z-10">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-start gap-1 pt-2 text-xs">
            {/* use organisation status banner with defaults */}
            <StatusBanner
              status="approved"
              is_featured={false}
              is_published={software.is_published}
              borderRadius='0 0.75rem 0.75rem 0'
            />
          </div>
        </div>
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </div>
    </div>
  )
}
