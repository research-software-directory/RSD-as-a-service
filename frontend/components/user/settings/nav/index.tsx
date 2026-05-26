// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {usePathname,useSearchParams} from 'next/navigation'
import Link from 'next/link'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {settingsMenu} from './UserSettingsNavItems'

export default function UserSettingsNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const settings = searchParams?.get('settings') ?? 'profile'
  // console.group('UserSettingsNav')
  // console.log('settings...', settings)
  // console.groupEnd()
  return (
    <List
      component="nav"
      sx={{
        width:'100%'
      }}
    >
      {settingsMenu.map((item, pos) => {
        const selected = settings === settingsMenu[pos].id
        return (
          <ListItemButton
            data-testid="user-settings-nav-item"
            key={item.id}
            selected={selected}
            href={`${pathname}?settings=${item.id}`}
            LinkComponent={Link}
            // 3. Inform screen readers which page is active
            aria-current={selected ? 'page' : undefined}
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
