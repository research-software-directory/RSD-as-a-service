// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import useMenuItems from '~/config/useMenuItems'
import isActiveMenuItem from './isActiveMenuItem'

export default function DesktopMenu({activePath}:{activePath:string}) {
  const menuItems = useMenuItems()
  // console.group('DesktopMenu')
  // console.log('activePath...',activePath)
  // console.groupEnd()
  return (
    <div
      className={`hidden text-center lg:flex-1 lg:flex lg:justify-evenly lg:gap-5 xl:justify-start ${menuItems.length < 4 ? 'text-lg' : ''}`}>
      {menuItems.map(item => {
        const isActive = isActiveMenuItem({item, activePath})
        return (
          <Link key={item.path} href={item.path ?? ''} className={`${isActive ? 'nav-active' : ''}`}>
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
