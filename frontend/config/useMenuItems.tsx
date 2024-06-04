// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {menuItems} from '~/config/menuItems'
import useRsdSettings from './useRsdSettings'

export default function useMenuItems(){
  // get host settings
  const {host} = useRsdSettings()
  // filter menu items for this RSD instance
  const items = menuItems.filter(item=> {
    // if modules are defined in settings.json and in menuItems
    if (host?.modules && host?.modules?.length > 0 && item.module){
      // include only options defined for this RSD host
      return host.modules.includes(item.module)
    }
    // else all menuItems are allowed by default
    return true
  })

  return items
}
