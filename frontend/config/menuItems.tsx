// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import SettingsIcon from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'
import Diversity3Icon from '@mui/icons-material/Diversity3'

import {RsdModuleName} from './rsdSettingsReducer'

export type MenuModules = RsdModuleName | 'user'

export type MenuItemType = {
  type?: 'link' | 'function' |'divider' | 'pluginSlot'
  label: string,
  // used as url link
  path?: string,
  // used to match value for active page/section menu highlighting
  match?: string,
  // used to customize menu items per user/profile
  active?:(props:any)=>boolean
  icon?: JSX.Element,
  // optional, but fn is provided it will have higher priority
  // than path
  fn?: (props:any)=>void,
  // enables filtering of menuItems for the instance (defined in settings.json)
  module?: MenuModules
}

export type MenuItemProps = {
  // optional key values
  // [Key in RsdModule as string]:MenuItemType
  [K in RsdModuleName]:MenuItemType
}

// routes defined for nav/menu
// used in components/AppHeader
export const menuItems:MenuItemProps = {
  software:{
    path:'/software',
    match:'/software',
    label:'Software',
    module:'software',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('software')
  },
  projects:{
    path: '/projects',
    match: '/projects',
    label: 'Projects',
    module:'projects',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('projects')
  },
  organisations: {
    path: '/organisations',
    match: '/organisations',
    label: 'Organisations',
    module:'organisations',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('organisations')
  },
  communities:{
    path: '/communities',
    match: '/communities',
    label: 'Communities',
    module:'communities',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('software') && modules.includes('communities')
  },
  persons:{
    path: '/persons',
    match: '/persons',
    label: 'Persons',
    module:'persons',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('persons')
  },
  news:{
    path: '/news',
    match: '/news',
    label: 'News',
    module:'news',
    active:({modules}:{modules:RsdModuleName[]})=>modules.includes('news')
  }
}

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

/**
 * User menu items.
 * use active method to determine if item should be displayed
 */
export const userMenuItems: MenuItemType[] = [
  {
    module: 'user',
    type: 'link',
    label:'My software',
    active: ({role,modules})=> {
      // if modules provided check for software module too
      if (Array.isArray(modules)===true){
        return ['rsd_admin', 'rsd_user'].includes(role)===true && modules.includes('software')
      }
      // else only for roles
      return ['rsd_admin', 'rsd_user'].includes(role)
    },
    path:'/user/software',
    icon: <TerminalIcon />,
  }, {
    module: 'user',
    type: 'link',
    label:'My projects',
    active: ({role,modules})=> {
      // if modules provided check for projects module too
      if (Array.isArray(modules)===true){
        return ['rsd_admin', 'rsd_user'].includes(role)===true && modules.includes('projects')
      }
      // else only for roles
      return ['rsd_admin', 'rsd_user'].includes(role)
    },
    path:'/user/projects',
    icon: <ListAltIcon />,
  }, {
    module: 'user',
    type: 'link',
    label: 'My organisations',
    active: ({role,modules})=> {
      // if modules provided check for projects module too
      if (Array.isArray(modules)===true){
        return ['rsd_admin', 'rsd_user'].includes(role)===true && modules.includes('organisations')
      }
      // else only for roles
      return ['rsd_admin', 'rsd_user'].includes(role)
    },
    path: '/user/organisations',
    icon: <BusinessIcon />,
  }, {
    module: 'user',
    type: 'link',
    label: 'My communities',
    active: ({role,modules})=> {
      // if modules provided check for projects module too
      if (Array.isArray(modules)===true){
        return ['rsd_admin', 'rsd_user'].includes(role)===true && modules.includes('communities') && modules.includes('software')
      }
      // else only for roles
      return ['rsd_admin', 'rsd_user'].includes(role)
    },
    path: '/user/communities',
    icon: <Diversity3Icon />,
  }, {
    module: 'user',
    type: 'pluginSlot',
    label: 'Unused label for plugin slot',
  }, {
    module: 'user',
    type: 'divider',
    label: 'divider1',
    active: () => true
  }, {
    module: 'user',
    type: 'link',
    label: 'My settings',
    active: ({role})=> {
      // only for roles
      return ['rsd_admin', 'rsd_user'].includes(role)
    },
    path: '/user/settings',
    icon: <SettingsIcon />,
  }, {
    module: 'user',
    type: 'divider',
    label: 'divider2',
    active: ({role})=>['rsd_admin'].includes(role),
  }, {
    module: 'user',
    type: 'link',
    label: 'Administration',
    active: ({role})=>['rsd_admin'].includes(role),
    path: '/admin/rsd-invites',
    icon: <ManageAccountsIcon />,
  },{
    module: 'user',
    type: 'divider',
    label: 'divider3',
    // news devider
    active: ({role, modules})=>['rsd_admin'].includes(role) && modules.includes('news'),
  }, {
    module: 'user',
    type: 'link',
    label: 'News',
    // news menu item
    active: ({role,modules})=>['rsd_admin'].includes(role) && modules.includes('news'),
    path: '/news',
    icon: <CalendarViewMonthIcon />,
  }, {
    module: 'user',
    type: 'divider',
    label: 'divider4',
    active: ({role})=>['rsd_admin', 'rsd_user'].includes(role),
  }, {
    module: 'user',
    label: 'Logout',
    active: ({role})=>['rsd_admin', 'rsd_user'].includes(role),
    icon: <Logout/>,
    fn: () => {
      // forward to logout route
      // it removes cookies and resets the authContext
      location.href = '/logout'
    }
  },
]
