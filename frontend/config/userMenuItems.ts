// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MenuItemType} from './menuItems'

export const userMenuItems: MenuItemType[] = [
  {
    type: 'link',
    label:'My software',
    path:'/user/software'
  }, {
    type: 'link',
    label:'My projects',
    path:'/user/projects'
  }, {
    type: 'link',
    label: 'My organisations',
    path: '/user/organisations'
  }, {
    type: 'divider',
    label: 'divider1',
  },{
    type: 'function',
    label: 'Logout',
    fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href = '/logout'
    }
  },
]
