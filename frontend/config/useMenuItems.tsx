// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {menuItems, MenuItemType} from '~/config/menuItems'
import useRsdSettings from './useRsdSettings'

export default function useMenuItems(){
  // get host settings
  const {modules,activeModules} = useRsdSettings()
  const items:MenuItemType[] = []

  // loop active modules from settings to get menuItems order
  activeModules
    .forEach(name=>{
      // if there is menuItem for this module key=module
      if (menuItems.hasOwnProperty(name)){
        const item = menuItems[name]
        const rsdModule = modules[name]
        // we check if menu item should be shown based on settings.json
        if (rsdModule.hasOwnProperty('menuItem') && rsdModule.menuItem!==null){
          // we use custom label
          item.label = rsdModule.menuItem as string
          // we check if menu item should be shown based on menu active logic
          if (item.active && item?.active({modules:activeModules})){
            items.push(item)
          }
        }
      }
    })

  // console.group('useMenuItems')
  // console.log('items...', items)
  // console.groupEnd()

  return items

}
