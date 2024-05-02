// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {menuItems} from '~/config/menuItems'
import Link from 'next/link'

import isActiveMenuItem from './isActiveMenuItem'

export default function DesktopMenu({activePath}:{activePath:string}) {
  // console.group('DesktopMenu')
  // console.log('activePath...',activePath)
  // console.groupEnd()
  return (
    <div
      className="hidden lg:flex-1 lg:flex lg:justify-center text-lg ml-4 gap-5 text-center opacity-90 font-normal ">
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
