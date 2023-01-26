// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {UserSettingsType} from '~/types/SoftwareTypes'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'


export function useGetUserAgreementStatus(token: string, account: string, setAgreeTerms?: any, setNoticePrivacy?: any, setOpen?: any) {
  const [userInfo, setUserInfo] = useState<UserSettingsType>()

  useEffect(() => {
    async function getUser() {
      const respData = await fetchAgreementStatus(token, account)
      if (respData.status === 200 && typeof(respData.data) !== 'undefined') {
        setUserInfo(respData.data)
        if (typeof(setOpen) === 'function' && (respData.data.agree_terms === false || respData.data.notice_privacy_statement === false)) {
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
    if (token && account) {
      getUser()
    }
  }, [token, account, setAgreeTerms, setNoticePrivacy, setOpen])
  return userInfo
}

async function fetchAgreementStatus(token: string, account: string) {
  const url=`/api/v1/account?id=eq.${account}&select=agree_terms,notice_privacy_statement`
  try {
    const resp = await fetch(url, {headers: {...createJsonHeaders(token)}})
    const json: UserSettingsType[] = await resp.json()
    return {
      status: 200,
      data: json[0]
    }
  } catch (e: any) {
    logger(`Retrieving user agreement status failed: ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
