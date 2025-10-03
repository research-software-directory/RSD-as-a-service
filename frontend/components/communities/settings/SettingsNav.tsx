// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {settingsMenu} from './SettingsNavItems'
import {useCommunityContext} from '../context'

export default function CommunitySettingsNav() {
  const router = useRouter()
  const tab = router.query['tab'] ?? 'general'
  const {community:{slug}} = useCommunityContext()
  // console.group('CommunitySettingsNav')
  // console.log('description...', organisation.description)
  // console.groupEnd()
  return (
    <List
      component="nav"
      sx={{
        width:'100%'
      }}
    >
      {settingsMenu.map((item, pos) => {
        const selected = tab === settingsMenu[pos].id
        const url = `${router.pathname.replace('[slug]',slug)}?tab=${item.id}`
        return (
          <ListItemButton
            data-testid="community-settings-nav-item"
            key={`step-${pos}`}
            selected={selected}
            onClick={() => {
              router.push(url,url,{scroll:false})
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
