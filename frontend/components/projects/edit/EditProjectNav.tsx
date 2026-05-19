// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useParams} from 'next/navigation'
import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import {editProjectMenuItems} from './editProjectMenuItems'


export default function EditProjectNav({slug}:Readonly<{slug:string}>) {
  const {activeModules} = useRsdSettings()
  const params = useParams()
  const pageId = params?.page
  return (
    // 1. Label the nav so screen readers know its purpose
    <nav aria-label="Edit project navigation">
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editProjectMenuItems.map((item, pos) => {
          // show only "active" mention options
          if (item.active({modules: activeModules})===true){
            const isSelected = item.id === pageId
            return (
              // 2. Wrap button in a semantic ListItem (<li>)
              <ListItem
                key={item.id}
                disablePadding
              >
                <ListItemButton
                  data-testid="edit-project-nav-item"
                  key={`step-${pos}`}
                  selected={isSelected}
                  href={`/projects/${slug}/edit/${item.id}`}
                  LinkComponent={Link}
                  // 3. Inform screen readers which page is active
                  aria-current={isSelected ? 'page' : undefined}
                  sx={editMenuItemButtonSx}
                >
                  {/* 4. Hide icons from screen readers if they are purely decorative */}
                  <ListItemIcon aria-hidden="true">
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} secondary={item.status} />
                </ListItemButton>
              </ListItem>
            )
          }
        })}
      </List>
    </nav>
  )
}
