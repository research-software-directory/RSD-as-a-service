// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {organisationMenu} from './OrganisationNavItems'
import {OrganisationForOverview} from '../../types/Organisation'

type OrganisationNavProps = {
  isMaintainer: boolean,
  organisation: OrganisationForOverview
}

export default function OrganisationNav({isMaintainer, organisation}:OrganisationNavProps) {
  const router = useRouter()
  const page = router.query['page'] ?? ''
  return (
    <nav>
      <List sx={{
        width:'100%'
      }}>
        {organisationMenu.map((item, pos) => {
          let selected = false
          if (page && page!=='') {
            selected = page === organisationMenu[pos].id
          } else if (pos === 0) {
            // select first item by default
            selected=true
          }
          // const selected = router.query['id'] ?? organisationMenu[0].id
          if (item.isVisible({
            isMaintainer,
            children_cnt: organisation?.children_cnt
          }) === true) {
            return (
              <ListItemButton
                key={`step-${pos}`}
                selected={selected}
                onClick={() => {
                  router.push({
                    query: {
                      slug:router.query['slug'],
                      page:item.id
                    }
                  })
                }}
              >
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label(organisation)} secondary={item.status} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
