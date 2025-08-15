// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import ControlledSwitch from '~/components/form/ControlledSwitch'

export type LockAccountProps={
  id: string
  lock_account: boolean
  admin_facing_reason: string|null
  user_facing_reason: string|null
}

type LockUserModalProps = Readonly<{
  account: LockAccountProps,
  onCancel: () => void,
  onSubmit: (item:LockAccountProps) => void
}>

const config={
  formId: 'lock-user-form',
  modalTitle:'Lock account',
  lock:{
    label: 'Lock account',
  },
  user_facing_reason:{
    label: 'Additional user message',
    help: 'The basic message to user is "Your account is locked."',
    validation:{
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  admin_facing_reason:{
    label: 'Admin notes',
    help: 'Explain to others why this account is locked and who locked it?',
    validation:{
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
}

function addToAdminNotes(account:LockAccountProps,userName?:string){
  // if the account is already locked we do not modify admin notes
  if (account.lock_account===true) return account.admin_facing_reason
  // if userName is present and account is not locked we add who is locking
  if (userName) return `Locked by ${userName}`
}

export default function LockUserModal({account,onCancel,onSubmit}:LockUserModalProps) {
  const {user} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {register, handleSubmit,formState,watch,control} = useForm<LockAccountProps>({
    mode: 'onChange',
    defaultValues: {
      id: account.id,
      lock_account: account.lock_account,
      admin_facing_reason: addToAdminNotes(account,user?.name),
      user_facing_reason: account.user_facing_reason ?? ''
    }
  })
  const {errors, isValid, isDirty} = formState
  const [admin_facing_reason,user_facing_reason,lock_account] = watch(['admin_facing_reason','user_facing_reason','lock_account'])

  function handleCancel(e:any,reason: 'backdropClick' | 'escapeKeyDown') {
    // close only on escape, not if user clicks outside of the modal
    if (reason==='escapeKeyDown') onCancel()
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {config.modalTitle}
      </DialogTitle>
      <form
        id={config.formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full">

        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />

        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>


          <ControlledSwitch
            label={config.lock.label}
            name="lock_account"
            control={control}
            defaultValue={account.lock_account}
          />
          <div className="py-4" />
          <TextFieldWithCounter
            options={{
              error: errors.user_facing_reason?.message !== undefined,
              label: config.user_facing_reason.label,
              helperTextMessage: errors?.user_facing_reason?.message ?? config.user_facing_reason.help,
              helperTextCnt: `${user_facing_reason?.length || 0}/${config.user_facing_reason.validation.maxLength.value}`,
              variant:'outlined',
              disabled: !lock_account
            }}
            register={register('user_facing_reason', {
              ...config.user_facing_reason.validation
            })}
          />
          <div className="py-4" />
          <TextFieldWithCounter
            options={{
              error: errors.admin_facing_reason?.message !== undefined,
              label: config.admin_facing_reason.label,
              helperTextMessage: errors?.admin_facing_reason?.message ?? config.admin_facing_reason.help,
              helperTextCnt: `${admin_facing_reason?.length || 0}/${config.admin_facing_reason.validation.maxLength.value}`,
              variant:'outlined',
              disabled: !lock_account
            }}
            register={register('admin_facing_reason', {
              ...config.admin_facing_reason.validation
            })}
          />
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            onClick={onCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            formId={config.formId}
            disabled={isValid===false || isDirty===false}
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
