// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import Logout from '@mui/icons-material/Logout'

import {MenuItemType} from './menuItems'

export const userMenuItems: MenuItemType[] = [
  {
    type: 'link',
    label:'My software',
    path:'/user/software',
    icon: <TerminalIcon/>
  }, {
    type: 'link',
    label:'My projects',
    path:'/user/projects',
    icon: <ListAltIcon/>
  }, {
    type: 'link',
    label: 'My organisations',
    path: '/user/organisations',
    icon: <BusinessIcon/>
  }, {
    type: 'divider',
    label: 'divider1',
  },{
    label: 'Logout',
    icon: <Logout/>,
    fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href = '/logout'
    }
  },
]
