// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import CheckIcon from '@mui/icons-material/Check'
import InfoIcon from '@mui/icons-material/Info'

import {useForm} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import useRsdSettings from '~/config/useRsdSettings'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import {UserSettingsType, patchAccountTable, useUserAgreements} from './useUserAgreements'

type UserSettingsModalForm = UserSettingsType & {
  account: string
}

export default function UserAgreementModal() {
  const {host} = useRsdSettings()
  const {token,user} = useSession()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const router = useRouter()
  const {showErrorMessage} = useSnackbar()
  const {loading, agree_terms,notice_privacy_statement} = useUserAgreements()
  const [open, setOpen] = useState<boolean>(false)
  const {handleSubmit,register,control,watch} = useForm<UserSettingsModalForm>({
    mode: 'onChange',
    defaultValues: {
      account: user?.account,
      agree_terms,
      notice_privacy_statement
    }
  })

  const [agreeTerms, privacyStatement] = watch(['agree_terms','notice_privacy_statement'])

  // console.group('UserAgreementModal')
  // console.log('loading...', loading)
  // console.log('agree_terms...', agree_terms)
  // console.log('notice_privacy_statement...', notice_privacy_statement)
  // console.log('agreeTerms...', agreeTerms)
  // console.log('privacyStatement...', privacyStatement)
  // console.log('open...', open)
  // console.groupEnd()

  /**
  * This effect runs only on load when initial
  * values are loaded by useUserAgreements hook
  * The effect should not react on value changes in the form
  */
  useEffect(() => {
    let abort = false
    if (loading === false && user?.role !== 'rsd_admin' &&
      (agree_terms === false || notice_privacy_statement === false)
    ) {
      if (abort===false) setOpen(true)
    }

    return () => { abort = true }
  },[loading,agree_terms,notice_privacy_statement,user?.role])

  function onSubmit(data: UserSettingsModalForm) {
    // console.log('onSubmit.data...', data)
    // updated the values in the database
    patchAccountTable({
      account: data.account,
      data: {
        agree_terms: data.agree_terms,
        notice_privacy_statement: data.notice_privacy_statement
      },
      token
    }).then((resp) => {
      if (resp?.status === 200) {
        setOpen(false)
      } else {
        showErrorMessage(`Failed to restore agreements. ${resp?.message}`)
      }
    }).catch((err) => {
      showErrorMessage(`Failed to restore agreements. ${err?.message}`)
    })
  }

  if (loading) return null

  return (
    <Dialog
      data-testid="user-agreement-modal"
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
    >
      <form
        id="user-agreement-form"
        data-testid="user-agreement-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden"
          {...register('account', {required:'account id is required'})}
        />
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
          /> User agreements
        </DialogTitle>

        <DialogContent sx={{
          width:['100%','33rem']
        }}>

          {/* Render only if userInfo present in order to properly load defaultValues */}
          <div className="py-4">
            To be able to contribute to the RSD, we need to know that you agree to our Terms of Service, and that you have read the Privacy Statement. Please check all of the points below to proceed:
          </div>
          <div>
            <ControlledSwitch
              defaultValue={agree_terms}
              name='agree_terms'
              control={control}
              // onSave={setAgreeTerms}
              label={
                <span>I agree to the <Link className="underline" target='_blank' href={host?.terms_of_service_url ?? ''}>Terms of Service</Link>.</span>
              }
            />
          </div>
          <div>
            <ControlledSwitch
              defaultValue={notice_privacy_statement}
              name='notice_privacy_statement'
              control={control}
              // onSave={setPrivacyStatement}
              label={
                <span>I have read the <Link className='underline' target='_blank' href={host?.privacy_statement_url ?? ''}>Privacy Statement</Link>.</span>
              }
            />
          </div>
          <p className="py-4">You may view or modify your agreement at any time in your profile settings.</p>
        </DialogContent>

        <DialogActions sx={{
          padding: '1rem 1.5rem',
        }}>
          <Button
            // on cancel go to the homepage
            onClick={()=>router.push('/')}
            color="secondary"
            sx={{
              marginRight: '1rem',
            }}
          >
            Cancel
          </Button>
          <Button
            form="user-agreement-form"
            disabled={!(agreeTerms && privacyStatement)}
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              <CheckIcon />
            }
          >
            Accept
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
