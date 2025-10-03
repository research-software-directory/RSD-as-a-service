// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useSession} from '~/auth/AuthProvider'
import SvgFromString from '~/components/icons/SvgFromString'
import {MenuItemType, userMenuItems} from './menuItems'
import useRsdSettings from './useRsdSettings'
import {usePluginSlots} from './RsdPluginContext'

export default function useUserMenuItems(){
  const {user} = useSession()
  const {activeModules} = useRsdSettings()
  // get user menu plugins
  const pluginSlots = usePluginSlots('userMenu')
  // construct menu items
  const items: MenuItemType[] = []

  userMenuItems.forEach( (item) => {
    if (item.active?.({role: user?.role, modules:activeModules})){
      items.push(item)
    } else if (item.type == 'pluginSlot') {
      // add plugins to user menu
      pluginSlots.forEach(pluginSlot => {
        items.push({
          module: 'user',
          type: 'link',
          label: pluginSlot.title,
          path: pluginSlot.href,
          icon: <SvgFromString svg={pluginSlot.icon} />,
        })
      })
    }
  })

  // console.group('useUserMenuItems')
  // console.log('modules...', host?.modules)
  // console.log('items...', items)
  // console.groupEnd()

  return items
}
