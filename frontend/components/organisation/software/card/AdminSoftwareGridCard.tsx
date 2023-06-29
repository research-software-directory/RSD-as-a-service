// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {SoftwareOfOrganisation} from '~/types/Organisation'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import SoftwareCardContent from '~/components/software/overview/cards/SoftwareCardContent'
import StatusBanner from '~/components/cards/StatusBanner'
import {useSoftwareCardActions} from './useSoftwareCardActions'

type AdminSoftwareCardProps = {
  item: SoftwareOfOrganisation
}

export default function AdminSoftwareGridCard({item:software}: AdminSoftwareCardProps) {
  const {menuOptions, onAction} = useSoftwareCardActions({software})

  // console.group('AdminSoftwareGridCard')
  // console.log('item...', item)
  // console.log('status...', software.status)
  // console.log('is_published...', software.is_published)
  // console.log('is_featured...', software.is_featured)
  // console.groupEnd()

  return (
    <div
      data-testid="admin-software-grid-card"
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
            <StatusBanner
              status={software.status}
              is_featured={software.is_featured}
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
