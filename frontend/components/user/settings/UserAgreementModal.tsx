// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import CheckIcon from '@mui/icons-material/Check'
import InfoIcon from '@mui/icons-material/Info'

import {useSession} from '~/auth'
import UserAgreementForm from './UserAgreementForm'
import {FormProvider, useForm} from 'react-hook-form'
import {useGetUserAgreementStatus} from './useGetUserAgreementStatus'
import {UserSettingsType} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchAccountTable} from './patchAccountTable'

export default function UserAgrementModal() {
  const {token,user} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const router = useRouter()
  const {showErrorMessage} = useSnackbar()

  const [open, setOpen] = useState<boolean>(false)
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  const [noticePrivacy, setNoticePrivacy] = useState<boolean>(false)

  const userInfo = useGetUserAgreementStatus(token, user, setAgreeTerms, setNoticePrivacy, setOpen)

  const methods = useForm<UserSettingsType>({
    mode: 'onChange'
  })

  function onCancel() {
    // Reset the values to their initival values if the user wants to cancel
    patchAccountTable({
      account: user?.account ?? '',
      data: {...userInfo},
      token
    }).then((resp) => {
      if (resp?.status === 200) {
        router.back()
      }
    }, (reason) => {
      showErrorMessage(`Failed to restore agreements. ${reason?.message}`)
    })
  }

  function onClose(event?:any,reason?:'backdropClick' | 'escapeKeyDown') {
    if (typeof reason==='undefined') {
      // we do not close modal on backdrop click or escape key
      // only when user clicks on Cancel button the reason is undefined
      setOpen(false)
    }
  }

  return (
    <Dialog
      data-testid="user-agreement-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        color: 'secondary.main',
        fontWeight: 500
      }}>
        <InfoIcon
          sx={{
            width: '2rem',
            height: '2rem',
            margin: '0rem 0.5rem 0.25rem 0rem'
          }}
        /> User agreement
      </DialogTitle>

      <DialogContent sx={{
          width:['100%','33rem']
      }}>
        {/* Render only if userInfo present in order to properly load defaultValues */}
        {userInfo &&
          <FormProvider {...methods}>
            <UserAgreementForm
              showTitle={false}
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
              noticePrivacyStatement={noticePrivacy}
              setNoticePrivacy={setNoticePrivacy}
            />
          </FormProvider>
        }
        <p>You may view or modify your agreement at any time in your profile settings.</p>
      </DialogContent>

        <DialogActions sx={{
          padding: '1rem 1.5rem',
        }}>
          <Button
            tabIndex={1}
            onClick={onCancel}
            color="secondary"
            sx={{
              marginRight: '1rem',
            }}
          >
            Cancel
          </Button>
          <Button
            tabIndex={0}
            disabled={!(agreeTerms && noticePrivacy)}
            type="button"
            variant="contained"
            color="primary"
            endIcon={
              <CheckIcon />
            }
            onClick={onClose}
          >
            OK
          </Button>
        </DialogActions>

    </Dialog>
  )
}
