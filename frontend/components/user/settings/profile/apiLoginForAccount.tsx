// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export type LoginForAccount={
  id:string
  account:string
  provider:string
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

export async function deleteFromOrcidList(orcid:string,token:string){
  try{
    const query=`orcid=eq.${orcid}`
    const url = `${getBaseUrl()}/orcid_whitelist?${query}`

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

export function findOrcidInLogin(logins:LoginForAccount[]){
  try{
    const orcid = logins.find(item=>item?.provider==='orcid')
    if (orcid){
      return orcid.sub
    }
    return null
  }catch{
    return null
  }
}

// export function useLoginForAccount(){
//   const {token, user} = useSession()
//   const {showErrorMessage} = useSnackbar()
//   const [loading, setLoading]=useState(true)
//   const [accounts, setAccounts]=useState<LoginForAccount[]>([])
//   const orcidLogin = accounts.find(item=>item.provider==='orcid')

//   useEffect(()=>{
//     let abort=false

//     async function getLogins(account:string){
//       setLoading(true)
//       const accounts = await getLoginForAccount({account,token})
//       if (abort) return null
//       setAccounts(accounts)
//       setLoading(false)
//     }

//     if (token && user?.account){
//       getLogins(user.account)
//     }

//     return ()=>{abort=true}
//   },[token,user?.account])


//   async function deleteLogin(id:string){
//     const resp = await deleteLoginForAccount(id,token)
//     if (resp.status!==200){
//       showErrorMessage(`Failed to remove login. ${resp.message}`)
//     }else{
//       const acc = accounts.find(account=>account.id===id)
//       // remove account from state and update
//       const newList = accounts.filter(account=>account.id!==id)
//       setAccounts(newList)
//       // for ORCID account remove it from orcid list too
//       if (acc?.provider==='orcid'){
//         deleteFromOrcidList(acc.sub,token)
//       }
//     }
//   }

//   return {
//     loading,
//     accounts,
//     orcidLogin,
//     deleteLogin
//   }
// }

