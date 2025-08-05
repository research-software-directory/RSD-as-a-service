// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import {EditProjectPageId} from './EditProjectPageContent'
import {editProjectMenuItems} from './editProjectMenuItems'

export default function EditProjectNav({slug,pageId}:Readonly<{slug:string,pageId:EditProjectPageId}>) {
  const {activeModules} = useRsdSettings()
  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editProjectMenuItems.map((item, pos) => {
          // show only "active" mention options
          if (item.active({modules: activeModules})===true){
            return (
              <ListItemButton
                data-testid="edit-project-nav-item"
                key={`step-${pos}`}
                selected={item.id === pageId}
                href={`/projects/${slug}/edit/${item.id}`}
                LinkComponent={Link}
                sx={editMenuItemButtonSx}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} secondary={item.status} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
