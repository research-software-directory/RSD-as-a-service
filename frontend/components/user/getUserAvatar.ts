// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'

export async function getUserAvatar(id?:string,token?:string){
  try{
    if (id && token){
      const query=`select=avatar_id&account=eq.${id}`
      const url=`${getBaseUrl()}/user_profile?${query}`
      // console.log(url)
      const resp = await fetch(url,{
        method: 'GET',
        headers: {
          ...createJsonHeaders(token),
        },
      })
      if (resp.ok){
        const data = await resp.json()
        // console.log('data...', data)
        if (data?.length===1){
          return data[0].avatar_id as string
        }
        return null
      }
      // otherwise request failed
      logger(`getUserAvatar failed: ${resp.status} ${resp.statusText}`, 'warn')
      return null
    }
    return null
  }catch(e:any){
    logger(`getUserAvatar: ${e.message}`)
    return null
  }
}
