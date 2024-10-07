// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import SvgFromString from '~/components/icons/SvgFromString'
import {MenuItemType, userMenuItems} from './menuItems'
import useRsdSettings from './useRsdSettings'
import {usePluginSlots} from './RsdPluginContext'

export default function useUserMenuItems(){
  const {user} = useSession()
  const {host} = useRsdSettings()
  // get user menu plugins
  const pluginSlots = usePluginSlots('userMenu')
  // construct menu items
  const items: MenuItemType[] = []

  userMenuItems.forEach( (item) => {
    if (item.active?.({role: user?.role, modules: host.modules})){
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

  return items
}
