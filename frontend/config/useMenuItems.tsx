// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
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
    if (Array.isArray(host?.modules)===true && item.active){
      // include only options defined for this RSD host
      return item.active({modules:host?.modules})
    }
    // else all menuItems are allowed by default
    return true
  })

  return items
}
