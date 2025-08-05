// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'

import {useSession} from '~/auth/AuthProvider'
import RsdLoginList from './RsdLoginList'
import {RsdAccountInfo} from './useRsdAccounts'
import RsdRoleSwitch from './RsdRoleSwitch'
import Box from '@mui/material/Box'
import LockPersonIcon from '@mui/icons-material/LockPerson'

type RsdUserItemProps = {
  account: RsdAccountInfo,
  onDelete: (id:string)=>void,
  onLock: (account:RsdAccountInfo) => void
}

export default function RsdAccountItem({account, onDelete, onLock}: Readonly<RsdUserItemProps>) {
  const {user} = useSession()

  return (

    <ListItem
      data-testid="account-item"
      key={account.id}
      secondaryAction={
        <div className="flex gap-2">
          <RsdRoleSwitch
            id={account.id}
            admin_account={account.admin_account}
            disabled={user?.account === account.id}
          />
          <IconButton
            aria-label="lock account"
            title="Show user locking form"
            onClick={()=>onLock(account)}
          >
            <LockPersonIcon color={account.locked_account === null ? 'action' : 'error'} />
          </IconButton>
          <IconButton
            disabled={user?.account === account.id}
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete(account.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      }
      sx={{
        // this makes space for buttons
        paddingRight:'8.5rem',
        '&:hover': {
          backgroundColor:'grey.100'
        }
      }}
    >
      <ListItemText>
        <div className="text-base-content-disabled">{account.id}</div>
        {account.locked_account ? <Box sx={{color: 'error.main'}}>{`Locked since ${new Date(account.locked_account.created_at).toUTCString()}`}</Box> : null}
        <RsdLoginList logins={account.login_for_account} />
      </ListItemText>
    </ListItem>

  )

}
