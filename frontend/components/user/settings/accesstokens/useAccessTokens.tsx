// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useState, useEffect} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'

import {useSession} from '~/auth/AuthProvider'
import {getUserAccessTokens, createUserAccessToken, deleteUserAccessToken, NewAccessToken, AccessToken} from './apiAccessTokens'

export function useAccessTokens() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [activeTokens, setActiveTokens] = useState<AccessToken[]>([])

  const getTokens = useCallback(async () => {
    setLoading(true)

    const accessTokens:AccessToken[] = await getUserAccessTokens({token})
    setActiveTokens(accessTokens)
    setLoading(false)

  },[token])

  const createToken = useCallback(async (accesstoken:NewAccessToken) => {
    const resp = await createUserAccessToken({accesstoken, token})
    if (resp.status===201){
      getTokens()
      return resp.message as string
    }else{
      showErrorMessage(`${resp.status} - Failed to create access token. ${resp.message}`)
      return undefined
    }
  }, [token, getTokens, showErrorMessage])

  const deleteToken = useCallback(async({id}:{id:string}) => {
    const resp = await deleteUserAccessToken({id,token})

    if (resp.status!==200) {
      showErrorMessage(`Failed to delete invite. ${resp.message}`)
    } else {
      getTokens()
    }

  }, [token, getTokens, showErrorMessage])

  useEffect(() => {
    getTokens()
  }, [getTokens])

  return {
    loading,
    activeTokens,
    createToken,
    deleteToken
  }
}
