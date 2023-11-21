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

import {useFormContext} from 'react-hook-form'
import OrcidLink from '~/components/layout/OrcidLink'
import {LoginForAccount} from './useLoginForAccount'
import {UserSettingsType} from './useUserAgreements'


function LoginAccount({account,onDelete}:{account:LoginForAccount,onDelete:()=>void}){
  // watch for changes in public_orcid_profile
  // FormProvider context at parent is REQUIRED
  const {watch} = useFormContext<UserSettingsType>()
  const [public_orcid_profile]=watch(['public_orcid_profile'])
  // Delete enabled only for ORCID when public profile disabled
  const enabled = account.provider === 'orcid' && public_orcid_profile===false

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

type LoginForAccountListProps={
  accounts:LoginForAccount[]
  deleteLogin:(id:string)=>Promise<void>
}

export default function LoginForAccountList({accounts, deleteLogin}:LoginForAccountListProps) {
  return (
    <div className="py-4">
      <h2>Authentication methods</h2>
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
