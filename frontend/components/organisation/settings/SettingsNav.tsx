// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {settingsMenu} from './SettingsNavItems'

export default function OrganisationSettingsNav() {
  const router = useRouter()
  const settings = router.query['settings'] ?? 'general'
  // console.group('OrganisationNav')
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
        const selected = settings === settingsMenu[pos].id
        // const selected = router.query['id'] ?? organisationMenu[0].id
        return (
          <ListItemButton
            data-testid="organisation-settings-nav-item"
            key={`step-${pos}`}
            selected={selected}
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  settings:item.id
                }
              },{},{scroll:false})
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
