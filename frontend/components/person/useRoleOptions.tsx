// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

async function getRoleOptions(token:string){
  try{
    const url = `${getBaseUrl()}/rpc/suggested_roles`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const data: string[] = await resp.json()
      // sort entries
      return data.toSorted((a, b) => a.localeCompare(b))
    }

    logger(`getRoleOptions ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []

  }catch(e:any){
    logger(`getRoleOptions failed: ${e.message}`)
    return []
  }
}

export default function useRoleOptions(){
  const {token} = useSession()
  const [roles, setRoles] = useState<string[]>([])

  useEffect(()=>{
    let abort = false
    if (token){
      getRoleOptions(token)
        .then(data=>{
          // do not update on abort
          if (abort) return
          // convert to options
          // const options = createRoleOptions(data)
          setRoles(data)
        })
    }
    return ()=>{abort=true}
  },[token])

  return roles

}
