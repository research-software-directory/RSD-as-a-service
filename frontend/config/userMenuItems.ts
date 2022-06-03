// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MenuItemType} from './menuItems'

export const userMenuItems:MenuItemType[]=[{
  label:'Logout',
  fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href='/logout'
    }
  },{
    label:'My software',
    path:'/user/software'
  },{
    label:'My profile',
    path:'/user/profile'
  }
]
