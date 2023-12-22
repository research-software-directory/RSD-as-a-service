// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {userMenu} from './UserNavItems'

export type UserCounts = {
  software_cnt: number
  project_cnt: number
  organisation_cnt: number
}


export default function UserNav({selected, counts}:
  {selected:string, counts:UserCounts}) {
  const router = useRouter()
  const menuItems = Object.keys(userMenu)
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
              onClick={() => {
                // debugger
                router.push(`/user/${key}`)
              }}
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
