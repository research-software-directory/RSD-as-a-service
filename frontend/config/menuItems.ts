// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type MenuItemType = {
  type?: 'link' | 'function' |'divider'
  label: string,
  path?: string,
  active?: boolean
  // optional, but fn is provided it will have higher priority
  // than path
  fn?: Function,
}
// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItemType[] = [
  {path:'/software', label:'Software'},
  {path: '/projects', label: 'Projects'},
  {path: '/organisations', label: 'Organisations'}
]
