// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MenuItemType} from '~/config/menuItems'

type IsActiveMenuItemProps = {
  item: MenuItemType
  activePath: string
}

export default function isActiveMenuItem({item, activePath}:IsActiveMenuItemProps) {

  if (activePath && item.match) {
    // console.log('activePath...', activePath)
    // console.log('match...', item.match)
    // using startsWith to be activate root of the tree
    return activePath.startsWith(item.match)
  }

  return false
}
