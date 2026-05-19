// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 PERFACCT GmbH
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center) <d.mijatovic@esciencecenter.nl>
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
import {usePluginSlots} from '~/config/RsdPluginContext'
import SvgFromString from '~/components/icons/SvgFromString'
import {editSoftwareMenuItems} from './editSoftwareMenuItems'

export default function EditSoftwareNav({slug}:Readonly<{slug:string}>) {
  const params = useParams()
  const pageId = params?.page
  const {activeModules} = useRsdSettings()
  // get edit software plugins
  const pluginSlots = usePluginSlots('editSoftwareNav')

  // console.group("EditSoftwareNav")
  // console.log("pageId...",pageId)
  // console.groupEnd()

  return (
    // 1. Label the nav so screen readers know its purpose
    <nav aria-label="Edit software navigation">
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwareMenuItems.map(item => {
          if (item.active({modules:activeModules})===true){
            const isSelected = item.id === pageId
            return (
              // 2. Wrap button in a semantic ListItem (<li>)
              <ListItem
                key={item.id}
                disablePadding
              >
                <ListItemButton
                  data-testid="edit-software-nav-item"
                  selected={isSelected}
                  href={`/software/${slug}/edit/${item.id}`}
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
        {
          pluginSlots.map((pluginSlot) => {
            const url = pluginSlot.href ? pluginSlot.href.replace('{slug}', slug) : '#'
            return (
              // 2. Wrap button in a semantic ListItem (<li>)
              <ListItem
                key={pluginSlot.title}
                disablePadding
              >
                <ListItemButton
                  data-testid="edit-software-plugin-item"
                  selected={false}
                  href={url}
                  LinkComponent={Link}
                  // 3. Inform screen readers which page is active
                  aria-current={undefined}
                  sx={editMenuItemButtonSx}
                >
                  {/* 4. Hide icons from screen readers if they are purely decorative */}
                  <ListItemIcon aria-hidden="true">
                    <SvgFromString svg={pluginSlot.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={pluginSlot.title} secondary={''} />
                </ListItemButton>
              </ListItem>
            )
          })
        }
      </List>
    </nav>
  )
}
