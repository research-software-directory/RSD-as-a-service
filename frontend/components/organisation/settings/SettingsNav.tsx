// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter,useSearchParams,usePathname} from 'next/navigation'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {defaultTab, settingsMenu} from './SettingsNavItems'

export default function OrganisationSettingsNav() {
  const searchParam = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // decide on selected tab
  const settings = searchParam?.get('settings') ?? defaultTab

  // console.group('OrganisationSettingsNav')
  // console.log('searchParam...', searchParam)
  // console.log('pathname...', pathname)
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
            data-testid="organisation-settings-nav-item"
            key={`step-${pos}`}
            selected={selected}
            onClick={() => {
              const urlParams = new URLSearchParams(searchParam ?? '')
              // set settings param
              urlParams.set('settings',item.id)
              // construct url
              const url = `${pathname}?${urlParams.toString()}`
              // change url without page scroll
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
