// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 PERFACCT GmbH
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useRouter, useParams} from 'next/navigation'
import Link from 'next/link'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import useRsdSettings from '~/config/useRsdSettings'
import {usePluginSlots} from '~/config/RsdPluginContext'
import SvgFromString from '~/components/icons/SvgFromString'
import {editSoftwareMenuItems} from './editSoftwareMenuItems'

export default function EditSoftwareNav({slug}:Readonly<{slug:string}>) {
  const router = useRouter()
  const params = useParams()
  const pageId = params?.page
  const {activeModules} = useRsdSettings()
  // get edit software plugins
  const pluginSlots = usePluginSlots('editSoftwareNav')

  // console.group("EditSoftwareNav")
  // console.log("pageId...",pageId)
  // console.groupEnd()

  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwareMenuItems.map(item => {
          if (item.active({modules:activeModules})===true){
            return (
              <ListItemButton
                data-testid="edit-software-nav-item"
                key={item.id}
                selected={item.id === pageId}
                href={`/software/${slug}/edit/${item.id}`}
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
        {
          pluginSlots.map((pluginSlot) => {
            const url = pluginSlot.href ? pluginSlot.href.replace('{slug}', slug) : '#'
            return (
              <ListItemButton
                data-testid="edit-software-plugin-item"
                key={pluginSlot.title}
                selected={false}
                onClick={() => {
                  router.push(url)
                }}
                sx={editMenuItemButtonSx}
              >
                <ListItemIcon>
                  <SvgFromString svg={pluginSlot.icon}/>
                </ListItemIcon>
                <ListItemText primary={pluginSlot.title} secondary={''} />
              </ListItemButton>
            )
          })
        }
      </List>
    </nav>
  )
}

