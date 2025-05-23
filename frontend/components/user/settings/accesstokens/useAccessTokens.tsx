// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useState, useEffect} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'

import {useSession} from '~/auth'
import {getUserAccessTokens, createUserAccessToken, deleteUserAccessToken, NewAccessToken, AccessToken} from './apiAccessTokens'

export function useAccessTokens() {
  const {token, user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [activeTokens, setActiveTokens] = useState<AccessToken[]>([])

  useEffect(() => {
    getTokens()
  }, [])

  const getTokens = useCallback(() => {
    setLoading(true)

    getUserAccessTokens({token})
      .then(items => {
        const accessTokens:AccessToken[] = items.map((item: {id: string, created_at: string, expires_at: string, display_name:string, account: string}) => {
          return {
            id: item['id'],
            created_at: item['created_at'],
            expires_at: item['expires_at'],
            display_name: item['display_name']
          }
        })
        setActiveTokens(accessTokens)
      })
      .catch(()=>setActiveTokens([]))
      .finally(()=>setLoading(false))

  },[token])

  const createToken = useCallback((accesstoken:NewAccessToken): Promise<string> => {
    return createUserAccessToken({accesstoken, token})
      .then((resp)=>{
        if (resp.status===201){
          getTokens()
          return resp.message
        }else{
          showErrorMessage(`Failed to create access token. ${resp.message}`)
          return ''
        }
      })
      .catch(e=>{
        showErrorMessage(`Failed to create access token. ${e.message}`)
        return ''
      })
  }, [token, getTokens, showErrorMessage])

  const deleteToken = useCallback(async({id}:{id:string}) => {
    const resp = await deleteUserAccessToken({id,token})

    if (resp.status!==200) {
      showErrorMessage(`Failed to delete invite. ${resp.message}`)
    } else {
      getTokens()
    }

  }, [token, getTokens, showErrorMessage])

  return {
    loading,
    activeTokens,
    createToken,
    deleteToken
  }
}
