// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editSoftwarePage} from './editSoftwarePages'

export default function EditSoftwareNav({slug,pageId}:{slug:string,pageId:string}) {
  const router = useRouter()

  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwarePage.map((item, pos) => {
          return (
            <ListItemButton
              data-testid="edit-software-nav-item"
              key={`step-${pos}`}
              selected={item.id === pageId ?? false}
              onClick={() => {
                const location = `/software/${slug}/edit/${item.id}`
                // onChangeStep(pos)
                router.push(location)
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.status} />
            </ListItemButton>
          )
        })}
      </List>
    </nav>
  )
}

