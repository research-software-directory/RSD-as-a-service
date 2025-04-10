// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import OrcidLink from '~/components/layout/OrcidLink'
import {LoginForAccount} from './apiLoginForAccount'

type LoginItemProps=Readonly<{
  account:LoginForAccount,
  onDelete?:()=>void
}>

export function LoginItem({account,onDelete}:LoginItemProps){
  // console.group('LoginItem')
  // console.log('onDelete...', onDelete)
  // console.groupEnd()

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          disabled={typeof onDelete == 'undefined'}
          onClick={()=>{
            if (typeof onDelete !== 'undefined') onDelete()
          }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <VpnKeyIcon />
      </ListItemIcon>
      <ListItemText
        primary={account?.provider.toUpperCase() ?? ''}
        secondary={
          <>
            <span data-testid="user-settings-username">{account?.name ?? ''}</span>
            {/* Show ORCID and link to ORCID website */}
            {account?.provider==='orcid' ?
              <><br/><OrcidLink orcid={account?.sub}/></>
              : null
            }
            {account?.home_organisation ?
              <><br/><span data-testid="affiliation">{account?.home_organisation}</span></>
              : null
            }
          </>
        }
      />
    </ListItem>
  )
}
