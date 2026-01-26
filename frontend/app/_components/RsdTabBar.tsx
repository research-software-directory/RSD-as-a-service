// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Tabs from '@mui/material/Tabs'
import TabAsLink from '~/components/layout/TabAsLink'
import {JSX} from 'react'
import {usePathname} from 'next/navigation'

export type RsdTabItem = {
  id: string,
  label: string,
  icon: JSX.Element,
  href: string,
  visible: boolean
}

export default function RsdTabBar({tabBarItems}: {tabBarItems: RsdTabItem[]}) {
  const pathname = usePathname()
  const currentTab = tabBarItems.find((tab) => pathname === tab.href) ?? tabBarItems[0]

  return (
    <div className='bg-white rounded-sm mb-6'>
      <Tabs
        variant="scrollable"
        allowScrollButtonsMobile
        value={currentTab.id}
      >
        {tabBarItems.map((item: RsdTabItem) => {
          return item.visible && <TabAsLink
            icon={item.icon}
            key={item.id}
            label={item.label}
            value={item.id}
            href={item.href}
            scroll={false}
          />
          })}
      </Tabs>
    </div>
  )
}
