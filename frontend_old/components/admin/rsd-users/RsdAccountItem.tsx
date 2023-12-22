// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'

import {useSession} from '~/auth'
import RsdLoginList from './RsdLoginList'
import {RsdAccountInfo} from './useRsdAccounts'
import RsdRoleSwitch from './RsdRoleSwitch'

type RsdUserItemProps = {
  account: RsdAccountInfo,
  onDelete: (id:string)=>void
}


export default function RsdAccountItem({account, onDelete}: RsdUserItemProps) {
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
        <RsdLoginList logins={account.login_for_account} />
      </ListItemText>
    </ListItem>
  )

}
