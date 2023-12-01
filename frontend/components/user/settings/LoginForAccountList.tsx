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
import {useState} from 'react'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'

function LoginAccount({account,onDelete}:{account:LoginForAccount,onDelete:()=>void}){
  // watch for changes in public_orcid_profile
  // FormProvider context at parent is REQUIRED
  const {watch} = useFormContext<UserSettingsType>()
  const [public_orcid_profile]=watch(['public_orcid_profile'])
  // Delete enabled only for ORCID when public profile disabled
  const disabled = account.provider === 'orcid' && public_orcid_profile===true

  // console.group('LoginAccount')
  // console.log('public_orcid_profile...', public_orcid_profile)
  // console.groupEnd()

  return (
    <ListItem
      secondaryAction={
        account.provider === 'orcid' ?
          <IconButton
            edge="end"
            aria-label="delete"
            disabled={disabled}
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
          : null
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
type DeleteAccountModal={
  open: boolean
  account?: LoginForAccount
}

export default function LoginForAccountList({accounts, deleteLogin}:LoginForAccountListProps) {
  const [modal, setModal] = useState<DeleteAccountModal>({
    open: false
  })

  return (
    <div className="py-4">
      <h2>Authentication methods</h2>
      <List dense={true}>
        {accounts.map(account=>{
          return <LoginAccount
            key={account.id}
            account={account}
            onDelete={()=>setModal({
              open:true,
              account
            })}
          />
        })}
      </List>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove authentication method"
        body={
          <p>
            Are you sure you want to delete <strong>{modal?.account?.provider} authentication method</strong>?
          </p>
        }
        onCancel={() => {
          setModal({
            open: false
          })
        }}
        onDelete={() => {
          if (modal?.account?.['id']){
            deleteLogin(modal.account.id)
            setModal({
              open: false
            })
          }
        }}
      />
    </div>
  )
}
