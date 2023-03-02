// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import SettingsIcon from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

import {MenuItemType} from './menuItems'

export function getUserMenuItems(
    role: 'rsd_admin' | 'rsd_user'='rsd_user',
    orcidEnabled: boolean=false,
  ) {

  const userMenuItems: MenuItemType[] = [
    {
      type: 'link',
      label:'My software',
      active: ['rsd_admin', 'rsd_user'].includes(role),
      path:'/user/software',
      icon: <TerminalIcon />
    }, {
      type: 'link',
      label:'My projects',
      active:['rsd_admin','rsd_user'].includes(role),
      path:'/user/projects',
      icon: <ListAltIcon />
    }, {
      type: 'link',
      label: 'My organisations',
      active:['rsd_admin','rsd_user'].includes(role),
      path: '/user/organisations',
      icon: <BusinessIcon />
    }, {
      type: 'divider',
      label: 'divider1',
      active: ['rsd_admin', 'rsd_user'].includes(role),
    }, {
      type: 'link',
      label: 'My settings',
      active: ['rsd_admin','rsd_user'].includes(role),
      path: '/user/settings',
      icon: <SettingsIcon />
    }, {
      type: 'divider',
      label: 'divider2',
      active: ['rsd_admin'].includes(role)
    }, {
      type: 'link',
      label: 'Administration',
      active: ['rsd_admin'].includes(role),
      path: '/admin/public-pages',
      icon: <ManageAccountsIcon />
    }, {
      type: 'divider',
      label: 'divider3',
      active: ['rsd_admin','rsd_user'].includes(role),
    }, {
      label: 'Logout',
      active: ['rsd_admin', 'rsd_user'].includes(role),
      icon: <Logout/>,
      fn: () => {
        // forward to logout route
        // it removes cookies and resets the authContext
        location.href = '/logout'
      }
    },
  ]

  const items = userMenuItems.filter(item => {
    if ( item.active != false ) {
      return item
    }
  })
  return items
}
