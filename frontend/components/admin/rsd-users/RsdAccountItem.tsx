// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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
import Box from '@mui/material/Box'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import {useState} from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'

type RsdUserItemProps = {
  account: RsdAccountInfo,
  onDelete: (id:string)=>void,
  onMutation: () => void
}

const maxLengthLockedFields = 100

export default function RsdAccountItem({account, onDelete, onMutation}: Readonly<RsdUserItemProps>) {
  const {user, token} = useSession()
  const {showErrorMessage} = useSnackbar()

  const [showLockForm, setShowLockForm] = useState<boolean>(false)

  const [doingAsyncRequest, setDoingAsyncRequest] = useState<boolean>(false)

  const [newLockStatus, setNewLockStatus] = useState<boolean>(account.locked_account !== null)

  const [newAdminReason, setNewAdminReason] = useState<string | null>(account.locked_account?.admin_facing_reason ?? null)
  const isAdminReasonValid: boolean = (newAdminReason?.length ?? 0) <= maxLengthLockedFields

  const [newUserReason, setNewUserReason] = useState<string | null>(account.locked_account?.user_facing_reason ?? null)
  const isUserReasonValid: boolean = (newUserReason?.length ?? 0) <= maxLengthLockedFields

  const buttonsEnabled: boolean = !doingAsyncRequest && isAdminReasonValid && isUserReasonValid

  function closeLockFormWithoutSaving() {
    setNewLockStatus(account.locked_account !== null)
    setNewAdminReason(account.locked_account?.admin_facing_reason ?? null)
    setNewUserReason(account.locked_account?.user_facing_reason ?? null)
    setShowLockForm(false)
  }

  async function saveLockAccountAndClose() {
    const tableName = 'locked_account'
    const query = `${tableName}?account_id=eq.${account.id}`
    const url = `${getBaseUrl()}/${query}`

    const headers = createJsonHeaders(token)

    setDoingAsyncRequest(true)

    try {
      if (!newLockStatus) {
        const resp = await fetch(url, {method: 'DELETE', headers: headers})
        if (!resp.ok) {
          showErrorMessage(await resp.text())
        } else {
          setNewAdminReason(null)
          setNewUserReason(null)
          setShowLockForm(false)
          onMutation()
        }
      } else {
        const body = JSON.stringify({
          account_id: account.id,
          admin_facing_reason: newAdminReason === '' ? null : newAdminReason,
          user_facing_reason: newUserReason === '' ? null : newUserReason,
        })

        const resp = await fetch(url, {
          method: 'PUT',
          headers: {...headers, 'Prefer': 'resolution=merge-duplicates'},
          body: body,
        })
        if (!resp.ok) {
          showErrorMessage(await resp.text())
        } else {
          setShowLockForm(false)
          onMutation()
        }
      }
    } catch (e: any) {
      showErrorMessage(e)
    } finally {
      setDoingAsyncRequest(false)
    }
  }

  return (
    <Stack spacing={2}>
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
              onClick={() => {
                setShowLockForm(true)
              }}
            >
              <LockPersonIcon color={account.locked_account === null ? 'action' : 'primary'} />
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

      {showLockForm && (
        <form>
          <Stack direction="row" spacing={2} sx={{alignItems: 'baseline'}}>
            <FormControlLabel
              label="Lock account"
              control={<Switch
                defaultChecked={account.locked_account !== null}
                onChange={e => setNewLockStatus(e.target.checked)}
              />}
            />
            <TextField
              label="Admin facing reason"
              helperText={`${newAdminReason?.length ?? 0} / ${maxLengthLockedFields}`}
              error={!isAdminReasonValid}
              disabled={!newLockStatus}
              defaultValue={account.locked_account?.admin_facing_reason}
              onChange={e => setNewAdminReason(e.target.value)}
            />
            <TextField
              label="User facing reason"
              helperText={`${newUserReason?.length ?? 0} / ${maxLengthLockedFields}`}
              error={!isUserReasonValid}
              disabled={!newLockStatus}
              defaultValue={account.locked_account?.user_facing_reason}
              onChange={e => setNewUserReason(e.target.value)}
            />
            <Button variant="outlined" disabled={!buttonsEnabled} onClick={closeLockFormWithoutSaving}>Cancel</Button>
            <Button variant="contained" disabled={!buttonsEnabled} onClick={saveLockAccountAndClose}>Save</Button>
          </Stack>
        </form>
      )}
    </Stack>
  )

}
