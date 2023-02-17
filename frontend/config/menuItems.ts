// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {RsdRole} from '~/auth'

export type MenuItemType = {
  type?: 'link' | 'function' |'divider'
  label: string,
  path?: string,
  active?: boolean
  icon?: JSX.Element,
  // optional, but fn is provided it will have higher priority
  // than path
  fn?: Function,
}
// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItemType[] = [
  // {path:'/#whyrsd', label:'Why RSD'},
  {path:'/software', label:'Software'},
  {path: '/projects', label: 'Projects'},
  {path: '/organisations', label: 'Organisations'}
]
