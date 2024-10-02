// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editMenuItemButtonSx} from '~/config/menuItems'
import {editSoftwarePage} from './editSoftwarePages'
import useRsdSettings from '~/config/useRsdSettings'
import {PluginSlotNames, RsdPluginContext} from '~/config/RsdPluginContext'
import {useContext} from 'react'
import svgFromString from '~/utils/svgFromString'

export default function EditSoftwareNav({slug,pageId}:{slug:string,pageId:string}) {
  const router = useRouter()
  const {host} = useRsdSettings()
  const {pluginSlots} = useContext(RsdPluginContext)

  // default is true to follow useMenuItems approach
  const showCommunities = host.modules ? host.modules.includes('communities') : true

  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwarePage.map(item => {
          if (item.id === 'communities' && showCommunities === false){
            // skip communities if not enabled in the settings
          } else {
            return (
              <ListItemButton
                data-testid="edit-software-nav-item"
                key={item.id}
                selected={item.id === pageId}
                onClick={() => {
                  const location = `/software/${slug}/edit/${item.id}`
                  router.push(location)
                }}
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
            if (pluginSlot.name === PluginSlotNames.editSoftwareNav) {
              return (
                <ListItemButton
                  data-testid="edit-software-nav-item"
                  key={pluginSlot.title}
                  selected={false}
                  onClick={() => {
                    router.push(pluginSlot.href || '#')
                  }}
                  sx={editMenuItemButtonSx}
                >
                  <ListItemIcon>
                    {svgFromString(pluginSlot.icon)}
                  </ListItemIcon>
                  <ListItemText primary={pluginSlot.title} secondary={''} />
                </ListItemButton>
              )
            }
          })
        }
      </List>
    </nav>
  )
}

