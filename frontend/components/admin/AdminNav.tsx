// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useParams} from 'next/navigation'
import Link from 'next/link'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import {AdminMenuItemProps, adminPages, AdminPageTypes, defaultAdminPage} from './AdminNavItems'


export default function AdminNav() {
  const params = useParams()
  const items = Object.keys(adminPages)
  const {activeModules} = useRsdSettings()
  const page = params?.page as AdminPageTypes ?? defaultAdminPage

  // console.group('AdminNav')
  // console.log('params...',params)
  // console.log('items...',items)
  // console.log('activeModules...',activeModules)
  // console.groupEnd()

  return (
    <nav>
      <List sx={{
        '&.MuiList-root':{
          paddingTop: 0,
          paddingBottom: 0
        }
      }}>
        {items.map((key, pos) => {
          const item:AdminMenuItemProps = adminPages[key as AdminPageTypes]
          if (item.active({modules:activeModules})===true){
            return (
              <ListItemButton
                data-testid="admin-nav-item"
                key={`step-${pos}`}
                selected={key===page}
                href = {item.path}
                component = {Link}
                sx={{...editMenuItemButtonSx,
                  ':hover': {
                    color: 'text.primary'
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} secondary={item.subtitle} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
