// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSearchParams,usePathname,useRouter} from 'next/navigation'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {defaultNav, settingsMenu} from './SettingsNavItems'

export default function CommunitySettingsNav() {
  const router = useRouter()
  const searchParam = useSearchParams()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParam ?? '')
  const nav = searchParam?.get('nav') ?? defaultNav

  // console.group('CommunitySettingsNav')
  // console.log('nav...', nav)
  // console.groupEnd()

  return (
    <List
      component="nav"
      sx={{
        width:'100%'
      }}
    >
      {settingsMenu.map((item, pos) => {
        const selected = nav === settingsMenu[pos].id
        params.set('nav',item.id)
        const url = `${pathname}?${params.toString()}`
        return (
          <ListItemButton
            data-testid="community-settings-nav-item"
            key={`step-${pos}`}
            selected={selected}
            onClick={() => {
              router.push(url,{scroll:false})
            }}
            sx={editMenuItemButtonSx}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label()} secondary={item.status} />
          </ListItemButton>
        )
      })}
    </List>
  )
}
