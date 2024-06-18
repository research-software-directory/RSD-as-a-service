// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {userMenu} from './UserNavItems'
import useRsdSettings from '~/config/useRsdSettings'

export type UserCounts = {
  software_cnt: number
  project_cnt: number
  organisation_cnt: number
  community_cnt: number
}


export default function UserNav({selected, counts}:
  {selected:string, counts:UserCounts}) {
  const {host} = useRsdSettings()
  // default is true to follow useMenuItems approach
  const showCommunities = host.modules ? host.modules.includes('communities') : true
  // filter communities if defined in modules
  const menuItems = Object.keys(userMenu).filter(key=>{
    if (key === 'communities'){
      return showCommunities
    } else {
      return true
    }
  })
  return (
    <nav>
      <List sx={{
        width:'100%'
      }}>
        {menuItems.map((key, pos) => {
          const item = userMenu[key]
          return (
            <ListItemButton
              data-testid="user-nav-item"
              key={`step-${pos}`}
              selected={item.id === selected}
              href = {`/user/${key}`}
              component = {Link}
              sx={{...editMenuItemButtonSx,
                ':hover': {
                  color: 'text.primary'
                }}}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label(counts)} secondary={item.status} />
            </ListItemButton>
          )
        })}
      </List>
    </nav>
  )
}
