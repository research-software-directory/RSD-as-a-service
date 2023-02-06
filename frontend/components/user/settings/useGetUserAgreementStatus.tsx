// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {RsdUser} from '~/auth'
import {UserSettingsType} from '~/types/SoftwareTypes'
import {fetchAgreementStatus} from './fetchAgreementStatus'

export function useGetUserAgreementStatus(token: string, user:RsdUser|null, setAgreeTerms?: any, setNoticePrivacy?: any, setOpen?: any) {
  const [userInfo, setUserInfo] = useState<UserSettingsType>()

  useEffect(() => {
    async function getUser() {
      const respData = await fetchAgreementStatus(token, user?.account ?? '')
      if (respData.status === 200 && typeof(respData.data) !== 'undefined') {
        setUserInfo(respData.data)
        if (typeof (setOpen) === 'function' &&
          (respData.data.agree_terms === false || respData.data.notice_privacy_statement === false)
          // rsd_admin does not need to accept UA
            && user?.role !== 'rsd_admin') {
          setOpen(true)
        }
        if (
            typeof(setAgreeTerms) === 'function' && typeof(setNoticePrivacy) === 'function' &&
            typeof(respData.data.agree_terms) === 'boolean' && typeof(respData.data.notice_privacy_statement) === 'boolean'
          ) {
            setAgreeTerms(respData.data.agree_terms)
            setNoticePrivacy(respData.data.notice_privacy_statement)
        }
      }
    }
    if (token && user && user?.account) {
      getUser()
    }
  }, [token, user, setAgreeTerms, setNoticePrivacy, setOpen])
  return userInfo
}
