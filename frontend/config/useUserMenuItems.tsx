// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MenuItemType, userMenuItems} from './menuItems'
import {useSession} from '~/auth'
import useRsdSettings from './useRsdSettings'
import {useContext} from 'react'
import {PluginSlotNames, RsdPluginContext} from './RsdPluginContext'
import svgFromString from '~/utils/svgFromString'

export default function useUserMenuItems(){
  const {user} = useSession()
  const {host} = useRsdSettings()
  const {pluginSlots} = useContext(RsdPluginContext)

  const items: MenuItemType[] = []

  userMenuItems.forEach( (item) => {
    if (item.active && item.active({role: user?.role, modules: host.modules})){
      items.push(item)
    } else if (item.type == 'pluginSlot') {
      pluginSlots.forEach(
        (pluginSlot) => {
          if (pluginSlot.name == PluginSlotNames.userMenu) {
            items.push({
              module: 'user',
              type: 'link',
              label: pluginSlot.title,
              path: pluginSlot.href,
              icon: svgFromString(pluginSlot.icon),
            })
          }
        }
      )
    }
  })

  return items
}
