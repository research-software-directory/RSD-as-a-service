// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import useRsdSettings from '~/config/useRsdSettings'
import Link from 'next/link'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import {useFormContext} from 'react-hook-form'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useSession} from '~/auth'
import {patchAccountTable} from './patchAccountTable'

type UserAgreementFormProps = {
  agreeTerms: boolean,
  noticePrivacyStatement: boolean,
  showTitle?: boolean,
  setAgreeTerms: any,
  setNoticePrivacy: any
}

export default function UserAgreementForm({agreeTerms, noticePrivacyStatement, showTitle=true, setAgreeTerms, setNoticePrivacy}: UserAgreementFormProps) {
  const {host} = useRsdSettings()
  const {token, user} = useSession()
  const {control} = useFormContext()
  const {showErrorMessage} = useSnackbar()

  async function saveTermsAgreement(value: boolean) {
    const resp = await patchAccountTable({
      account: user?.account ?? '',
      data: {
        // name of the colum and the value
        ['agree_terms']: value
      },
      token
    })

    if (resp?.status === 200) {
      setAgreeTerms(value)
    } else {
      showErrorMessage(`Failed to save agreement. ${resp?.message}`)
    }
  }

  async function saveNoticePrivacyStatement(value: boolean) {
    const resp = await patchAccountTable({
      account: user?.account ?? '',
      data: {
        // name of the colum and the value
        ['notice_privacy_statement']: value
      },
      token
    })

    if (resp?.status === 200) {
      setNoticePrivacy(value)
    } else {
      showErrorMessage(`Failed to save agreement. ${resp?.message}`)
    }
  }


  return(
    <form
      id="profile-settings-form"
      className='flex-1'
    >
      <div className="py-4">
        {showTitle &&
          <h2>User agreements</h2>
        }
        <div className="py-4">To be able to contribute to the RSD, we need to know that you agree to our Terms of Service, and that you have read the Privacy Statement. Please check all of the points below to proceed:</div>
        <div>
          <ControlledSwitch
            defaultValue={agreeTerms}
            name='agree_terms'
            label=''
            control={control}
            onSave={saveTermsAgreement}
          />
          <span>I agree to the <Link className="underline" target='_blank' href={host?.terms_of_service_url ?? ''}>Terms of Service</Link>.</span>
        </div>
        <div>
          <ControlledSwitch
            defaultValue={noticePrivacyStatement}
            name='notice_privacy_statement'
            label=''
            control={control}
            onSave={saveNoticePrivacyStatement}
          />
          <span>I have read the <Link className='underline' target='_blank' href={host?.privacy_statement_url ?? ''}>Privacy Statement</Link>.</span>
        </div>
      </div>
    </form>
  )
}
