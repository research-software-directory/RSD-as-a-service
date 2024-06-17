// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {RsdModule} from './rsdSettingsReducer'

export type MenuItemType = {
  type?: 'link' | 'function' |'divider'
  label: string,
  // used as url link
  path?: string,
  // used to match value for active page/section menu highlighting
  match?: string,
  // used to customize menu items per user/profile
  active?: boolean
  icon?: JSX.Element,
  // optional, but fn is provided it will have higher priority
  // than path
  fn?: Function,
  // enables filtering of menuItems for the instance (defined in settings.json)
  module?: RsdModule
}
// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItemType[] = [
  {path: '/software?order=mention_cnt', match:'/software', label:'Software', module:'software'},
  {path: '/projects?order=impact_cnt', match: '/projects', label: 'Projects', module:'projects'},
  {path: '/organisations', match: '/organisations', label: 'Organisations', module:'organisations'},
  {path: '/communities', match: '/communities', label: 'Communities', module:'communities'}
]

// ListItemButton styles for menus used on the edit pages
export const editMenuItemButtonSx={
  padding: '0.75rem 1rem',
  '&.Mui-selected > div >span': {
    fontWeight:500
  }
}


/**
 * Breakpoint in px when to show mobile menu (burger)
 */
export const mobileMenuBreakpoint='880px'
