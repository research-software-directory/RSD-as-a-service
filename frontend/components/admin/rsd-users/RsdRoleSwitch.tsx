// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {addRsdAdmin, removeRsdAdmin} from './apiRsdUsers'

type RsdRoleSwitchProps={
  id:string,
  admin_account: {account_id: string} | null
  disabled: boolean
}

export default function RsdRoleSwitch({id,admin_account,disabled}:RsdRoleSwitchProps) {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const [value, setValue] = useState(admin_account ? true : false)

  // useEffect(()=>{
  //   if (admin_account){
  //     setValue(true)
  //   }else{
  //     setValue(false)
  //   }
  // },[admin_account])

  async function onRsdAdmin({target}:{target:HTMLInputElement}){
    // save previous value for rollback
    const previousValue = value
    // update value (optimistically)
    setValue(target.checked)

    if (target.checked){
      // add id to admin table
      const resp = await addRsdAdmin({
        id,
        token
      })
      if (resp.status===200){
        showSuccessMessage('Upgraded user to rsd-admin role')
      }else{
        showErrorMessage(`Failed to apply rsd-admin role. ${resp.message}`)
        setValue(previousValue)
      }
    } else {
      // remove id from admin table
      const resp = await removeRsdAdmin({
        id,
        token
      })
      if (resp.status===200){
        showSuccessMessage('Removed rsd-admin role')
      }else{
        showErrorMessage(`Failed to remove rsd-admin role. ${resp.message}`)
        setValue(previousValue)
      }
    }
  }

  return (
    <FormControlLabel
      data-testid="controlled-switch-label"
      title="Administrator"
      control={
        <Switch
          data-testid="controlled-switch"
          checked={value}
          onChange={onRsdAdmin}
        />
      }
      sx={{color:'text.secondary'}}
      label={
        <ManageAccountsIcon />
      }
      labelPlacement="end"
      disabled={disabled}
    />
  )
}
