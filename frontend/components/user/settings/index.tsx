// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {FormProvider, useForm} from 'react-hook-form'
import {useSession} from '~/auth'
import {UserSettingsType} from '~/types/SoftwareTypes'
import {useGetUserAgreementStatus} from './useGetUserAgreementStatus'
import UserAgreementForm from './UserAgreementForm'
import RemoveAccount from './RemoveAccount'

export default function UserSettings() {
  const {token,user} = useSession()
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  const [noticePrivacy, setNoticePrivacy] = useState<boolean>(false)
  const userInfo = useGetUserAgreementStatus(token, user, setAgreeTerms, setNoticePrivacy)
  const disableRemove = agreeTerms===false || noticePrivacy===false

  const methods = useForm<UserSettingsType>({
    mode: 'onChange',
  })

  // console.group('UserSettings')
  // console.log('userInfo...', userInfo)
  // console.log('disableRemove...', disableRemove)
  // console.groupEnd()

  return (
    <div data-testid="user-profile-section">
      <h2>Your profile properties</h2>
      <div className="py-4">
        <div>Account id</div>
        {user?.account ?? ''}
      </div>
      <div className="py-4">
        <div>Name</div>
        {user?.name ?? ''}
      </div>
      <div className="py-4">
        <div>Role</div>
        {user?.role ?? ''}
      </div>
      {/* Render only if userInfo present in order to properly load defaultValues */}
      {userInfo &&
        <FormProvider {...methods}>
          <UserAgreementForm
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            noticePrivacyStatement={noticePrivacy}
            setNoticePrivacy={setNoticePrivacy}
          />
        </FormProvider>
      }
      {user?.account &&
        <RemoveAccount disabled={disableRemove ?? true} />
      }
    </div>
  )
}
