// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {deleteRsdAccount} from '~/components/admin/rsd-users/apiRsdUsers'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useRsdSettings from '~/config/useRsdSettings'
import {UserSettingsType} from './useUserAgreements'

function RemoveAccountBody(props:any) {
  return (
    <p {...props}>
      Your account will be deleted. You will no longer be able to edit software, projects and organisations that you are a maintainer of. All unused maintainer invitations created by you will be deleted. The software, project and organisation pages you currently maintain <strong>will not be removed</strong> from the RSD.
    </p>
  )
}

function RemoveAccountAlert({disabled}: Readonly<{disabled:boolean}>) {
  const {host} = useRsdSettings()
  // if remove account button is disabled
  if (disabled===true) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>Removing your RSD account</AlertTitle>
        In order to be able to remove your account from RSD you first need to accept Terms of Service and Privacy Statement. After that remove account button will be enabled. If you do not wish to accept the terms of service but want your account to be removed from RSD please <strong>send an email to RSD support at <a href={`mailto:${host.email}?subject=${encodeURIComponent('Remove RSD account')}`} target="_blank" rel="noreferrer">
          {host.email}</a></strong>.
      </Alert>
    )
  }
  // show alert about what will be removed
  return (
    <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight:500}}>This will remove your RSD account</AlertTitle>
      <RemoveAccountBody />
    </Alert>
  )
}

export default function RemoveAccount() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [modal, setModal] = useState(false)
  const {watch} = useFormContext<UserSettingsType>()
  const [agree_terms,notice_privacy_statement]=watch(['agree_terms','notice_privacy_statement'])
  const disabled = agree_terms===false || notice_privacy_statement===false

  // console.group('RemoveAccount')
  // console.log('agree_terms...', agree_terms)
  // console.log('notice_privacy_statement...', notice_privacy_statement)
  // console.log('disabled...', disabled)
  // console.groupEnd()

  function onDeleteAccount() {
    setModal(true)
  }

  async function deleteAccount() {
    if (user?.account) {
      const resp = await deleteRsdAccount({
        id: user?.account,
        token
      })
      // close modal
      setModal(false)
      if (resp.status === 200) {
        // forward to logout route (with full reload)
        // it removes cookies and resets the authContext
        location.href = '/logout'
      } else {
        showErrorMessage(`Failed to remove account ${user?.account}. ${resp.message}`)
      }
    }
  }

  if (user?.account) {
    return (
      <>
        <h2 className="pt-8">Remove account</h2>

        <RemoveAccountAlert disabled={disabled} />

        <div className="py-4">
          <Button
            disabled={disabled}
            variant="contained"
            color="error"
            onClick={onDeleteAccount}>
            Remove account
          </Button>
        </div>

        <ConfirmDeleteModal
          open={modal}
          title="Remove account"
          body={
            <>
              <p>
                Are you sure you want to completely remove your account?
              </p>
              <RemoveAccountBody className="py-4 text-sm" />
            </>
          }
          onCancel={() => {
            setModal(false)
          }}
          onDelete={deleteAccount}
        />
      </>
    )
  }
  // do not show if no account
  return null
}
