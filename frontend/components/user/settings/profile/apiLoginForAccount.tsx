// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {ProviderName} from '~/auth/api/getLoginProviders'

export type LoginForAccount={
  id:string
  account:string
  provider:ProviderName
  sub:string
  name:string
  email:string|null
  home_organisation:string|null
}

export async function getLoginForAccount({account,token}:{account?:string,token?:string}){
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

export async function deleteLoginForAccount(id:string,token:string){
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

export function findProviderSubInLogin(logins:LoginForAccount[],provider:ProviderName){
  try{
    const login = logins.find(item=>item?.provider===provider)
    if (login){
      return login.sub
    }
    return null
  }catch{
    return null
  }
}
