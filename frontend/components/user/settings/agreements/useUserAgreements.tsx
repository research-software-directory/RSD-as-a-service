// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import logger from '~/utils/logger'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export type UserSettingsType = {
  agree_terms: boolean,
  notice_privacy_statement: boolean
  // public_orcid_profile: boolean
}

const defaultResponse = {
  agree_terms: false,
  notice_privacy_statement: false,
  public_orcid_profile: false
}

export async function getUserAgreements(token: string, account: string) {
  const select = 'agree_terms,notice_privacy_statement'
  const query = `id=eq.${account}&select=${select}`
  const url = `${getBaseUrl()}/account?${query}`
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // require single object
        'Accept': 'application/vnd.pgrst.object+json'
      }
    })
    if (resp.status === 200) {
      const json: UserSettingsType = await resp.json()
      return json
    }

    logger(`getUserAgreements: ${resp.status} ${resp.statusText}`, 'warn')

    return defaultResponse

  } catch (e: any) {
    logger(`getUserAgreements failed: ${e.message}`, 'error')
    return defaultResponse
  }
}

export type PatchAccountTableProps = {
  account: string,
  data: {
    [key: string]: any
  },
  token: string
}

export async function patchAccountTable({account, data, token}: PatchAccountTableProps) {
  try {
    const url = `/api/v1/account?id=eq.${account}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, account)
  } catch (e: any) {
    logger(`patchAccountTable failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export function useUserAgreements() {
  const {token, user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [agreements, setAgreements]=useState<UserSettingsType>()

  useEffect(() => {
    let abort = false

    async function getAgreements() {
      setLoading(true)
      const settings = await getUserAgreements(token, user?.account ?? '')
      if (abort) return null
      setAgreements(settings)
      setLoading(false)
    }

    if (user?.account) {
      getAgreements()
    }

    return ()=>{abort=true}

  }, [token, user?.account])

  const setAgreeTerms = useCallback(async(agree_terms: boolean) => {
    if (user?.account) {
      const resp = await patchAccountTable({
        account: user?.account,
        token,
        data: {
          agree_terms
        }
      })
      if (resp.status !== 200){
        showErrorMessage(`Failed to update account. ${resp.message}`)
      } else {
        updateAgreements('agree_terms',agree_terms)
      }
    }
  // we do not add showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,user?.account])

  const setPrivacyStatement = useCallback(async(notice_privacy_statement: boolean) => {
    if (user?.account) {
      const resp = await patchAccountTable({
        account: user?.account,
        token,
        data: {
          notice_privacy_statement
        }
      })
      if (resp.status !== 200){
        showErrorMessage(`Failed to update account. ${resp.message}`)
      } else {
        updateAgreements('notice_privacy_statement',notice_privacy_statement)
      }
    }
  // we do not add showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.account])

  function updateAgreements(key: string, value: boolean) {
    if (agreements) {
      setAgreements({
        ...agreements,
        [key]:value
      })
    }
  }

  return {
    loading,
    ...agreements,
    setAgreeTerms,
    setPrivacyStatement,
  }
}
