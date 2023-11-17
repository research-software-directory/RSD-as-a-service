// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type LoginForAccount={
  id:string
  account:string
  provider:string
  sub:string
  name:string
  email:string
  home_organisation:string
}

async function getLoginForAccount(account:string,token:string){
  try{
    const query=`account=eq.${account}`
    const url = `${getBaseUrl()}/login_for_account?${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status===200){
      const json:LoginForAccount[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getLoginForAccount: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  }catch(e:any){
    logger(`getLoginForAccount failed: ${e.message}`, 'error')
    return []
  }
}

async function deleteLoginForAccount(id:string,token:string){
  try{
    const query=`id=eq.${id}`
    const url = `${getBaseUrl()}/login_for_account?${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp)
  }catch(e:any){
    return {
      status:500,
      message: e.message
    }
  }
}

export function useLoginForAccount(){
  const {token, user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading]=useState(true)
  const [accounts, setAccounts]=useState<LoginForAccount[]>([])
  const orcidLogin = accounts.find(item=>item.provider==='orcid')

  useEffect(()=>{
    let abort=false

    async function getLogins(account:string){
      setLoading(true)
      const accounts = await getLoginForAccount(account,token)
      if (abort) return null
      setAccounts(accounts)
      setLoading(false)
    }

    if (token && user?.account){
      getLogins(user.account)
    }

    ()=>{abort=true}
  },[token,user?.account])


  async function deleteLogin(id:string){
    const resp = await deleteLoginForAccount(id,token)
    if (resp.status!==200){
      showErrorMessage(`Failed to remove login. ${resp.message}`)
    }else{
      // remove account from state and update
      const newList = accounts.filter(account=>account.id!==id)
      setAccounts(newList)
    }
  }

  return {
    loading,
    accounts,
    orcidLogin,
    deleteLogin
  }
}
