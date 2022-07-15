// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {pagesMenu} from './PagesNavItems'

export default function UserNav({selected}:
  {selected:string}) {
  const router = useRouter()
  const menuItems = Object.keys(pagesMenu)
  return (
    <nav>
      <List sx={{
        width:'100%'
      }}>
        {menuItems.map((key, pos) => {
          const item = pagesMenu[key]
          return (
            <ListItemButton
              key={`step-${pos}`}
              selected={item.id === selected}
              onClick={() => {
                // debugger
                router.push(`/admin/pages/${key}`)
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.status} />
            </ListItemButton>
          )
        })}
      </List>
    </nav>
  )
}
