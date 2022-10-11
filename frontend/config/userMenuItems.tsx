// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Logout from '@mui/icons-material/Logout'

import {MenuItemType} from './menuItems'

const userMenuItems: MenuItemType[] = [
  {
    role:['rsd_admin','rsd_user'],
    type: 'link',
    label:'My software',
    path:'/user/software',
    icon: <TerminalIcon />
  }, {
    role:['rsd_admin','rsd_user'],
    type: 'link',
    label:'My projects',
    path:'/user/projects',
    icon: <ListAltIcon />
  }, {
    role:['rsd_admin','rsd_user'],
    type: 'link',
    label: 'My organisations',
    path: '/user/organisations',
    icon: <BusinessIcon />
  }, {
    role:['rsd_admin','rsd_user'],
    type: 'divider',
    label: 'divider1'
  }, {
    role:['rsd_admin'],
    type: 'link',
    label: 'Administration',
    path: '/admin/pages',
    icon: <ManageAccountsIcon />
  }, {
    role:['rsd_admin'],
    type: 'link',
    label: 'ORCID whitelist',
    path: '/admin/orcid-whitelist',
    icon: <PlaylistAddCheckIcon />
  }, {
    role:['rsd_admin'],
    type: 'divider',
    label: 'divider2'
  }, {
    role:['rsd_admin','rsd_user'],
    label: 'Logout',
    icon: <Logout/>,
    fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href = '/logout'
    }
  },
]

export function getUserMenuItems(role: 'rsd_admin' | 'rsd_user'='rsd_user') {
  const items = userMenuItems.filter(item => {
    return item.role?.includes(role)
  })
  return items
}
