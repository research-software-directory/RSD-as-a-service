// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {
  Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import InfoIcon from '@mui/icons-material/Info'

import {useSession} from '~/auth'
import UserAgreementForm, {patchAccountTable} from './settings/UserAgreementForm'
import {FormProvider, useForm} from 'react-hook-form'
import {useGetUserAgreementStatus} from './settings/useGetUserAgreementStatus'
import {UserSettingsType} from '~/types/SoftwareTypes'
import {useRouter} from 'next/router'
import useSnackbar from '~/components/snackbar/useSnackbar'

export default function UserAgrementModal() {
  const {token,user} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const router = useRouter()
  const {showErrorMessage} = useSnackbar()

  const [open, setOpen] = useState<boolean>(false)
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  const [noticePrivacy, setNoticePrivacy] = useState<boolean>(false)

  const userInfo = useGetUserAgreementStatus(token, user?.account ?? '', setAgreeTerms, setNoticePrivacy, setOpen)

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

  function onClose() {
    setOpen(false)
  }

  return (
    <Dialog
      data-testid="conform-delete-modal"
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
