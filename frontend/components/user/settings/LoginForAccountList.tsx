// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {LoginForAccount} from './useLoginForAccount'


function LoginAccount({account,onDelete}:{account:LoginForAccount,onDelete:()=>void}){
  // TODO! delete enabled only for ORCID???
  const enabled = account.provider === 'orcid'
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          disabled={!enabled}
          onClick={onDelete}
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
            <span data-testid="provider">{account?.name ?? ''}</span><br/>
            {account?.home_organisation ?
              <span data-testid="affiliation">{account?.home_organisation}</span>
              : null
            }
          </>
        }
      />
    </ListItem>
  )
}

type LoginForAccountListProps={
  accounts:LoginForAccount[]
  deleteLogin:(id:string)=>Promise<void>
}

export default function LoginForAccountList({accounts, deleteLogin}:LoginForAccountListProps) {
  return (
    <div className="py-4">
      <h3>Authentications</h3>
      <List dense={true}>
        {accounts.map(account=>{
          return <LoginAccount
            key={account.id}
            account={account}
            onDelete={()=>deleteLogin(account.id)}
          />
        })}
      </List>
    </div>
  )
}
