// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {splitName} from '~/utils/getDisplayName'
import logger from '~/utils/logger'
import {getLoginForAccount, LoginForAccount} from './apiLoginForAccount'

export type UserProfile = {
  account: string,
  given_names: string
  family_names: string
  email_address: string | null
  role: string | null
  affiliation: string | null
  is_public: boolean
  avatar_id: string | null
  description?: string | null
}

export type PublicUserProfile = UserProfile & {
  display_name: string
  orcid: string | null
}

export async function loadUserProfile({account,token}:{account?:string,token?:string}){
  try{
    // only if account and token provided
    if (!account || !token) return null
    // try to get profile from user_profile table
    const [profile,logins] = await Promise.all([
      getUserProfile({account,token}),
      getLoginForAccount({account,token})
    ])
    // const profile = await
    // console.log('loadUserProfile...profile...', profile)
    // return profile if found
    if (profile!==null) return {
      profile,
      logins
    }
    // get logins
    // const logins = await getLoginForAccount({account,token})
    // console.log('getLoginForAccount...logins...', logins)
    if (logins.length>0){
      const profile = convertLoginToProfile(logins)
      // console.log('convertLoginToProfile...profile...', profile)
      if (profile){
        const resp = await insertUserProfile({profile,token})
        if (resp?.status===200){
          return {
            profile,
            logins
          }
        }
        logger(`loadUserProfile.insertUserProfile: ${resp?.status}: ${resp?.message}`,'error')
        return {
          profile,
          logins
        }
      }
      return {
        profile,
        logins
      }
    }
    return {
      profile,
      logins
    }
  }catch(e:any){
    logger(`loadUserProfile: ${e.message}`,'error')
    return {
      profile: null,
      logins: []
    }
  }
}

export async function getUserProfile({account,token}:{account?:string,token?:string}){
  try{
    if (!account){
      logger('getUserProfile: account MISSING','warn')
      return null
    }

    const query = `account=eq.${account}`
    const url = `${getBaseUrl()}/user_profile?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200){
      const users:UserProfile[] = await resp.json()
      if (users.length === 1){
        return users[0]
      }
      // user profile not found
      return null
    }
    logger(`getUserProfile: ${resp.status}: ${resp.statusText}`,'warn')
    return null
  }catch(e:any){
    logger(`getUserProfile: ${e.message}`,'error')
    return null
  }
}

type UpdateUserProfileProps={
  account:string,
  data: Partial<UserProfile>,
  token:string
}

export async function patchUserProfile({account,data,token}:UpdateUserProfileProps){
  try {
    const url = `${getBaseUrl()}/user_profile?account=eq.${account}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export function convertLoginToProfile(logins:LoginForAccount[]){
  try{
    const login = logins[0]
    const profile: UserProfile = {
      account: login.account,
      ...splitName(login.name),
      email_address: login.email,
      affiliation: login.home_organisation,
      role: null,
      is_public: false,
      avatar_id: null,
      description: null
    }
    return profile
  }catch(e:any){
    logger(`convertLoginToProfile: ${e.message}`,'error')
    return null
  }
}

export async function insertUserProfile({profile,token}:{profile:UserProfile,token:string}){
  try{
    const url = `${getBaseUrl()}/user_profile`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(profile)
    })
    return extractReturnMessage(resp)
  }catch(e:any){
    logger(`insertUserProfile: ${e.message}`,'error')
    return null
  }
}

export async function getPublicUserProfile({orcid,account}:{orcid:string|null,account:string|null}){
  try{
    // filter on ORCID, order by image first
    let query = `orcid=eq.${orcid}`
    // if account provided use account
    if (account!==null){
      query = `account=eq.${account}`
    }
    const url = `${getBaseUrl()}/rpc/public_user_profile?${query}`
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders()
      }
    })
    if (resp.ok){
      const profiles:PublicUserProfile[] = await resp.json()
      if (profiles.length>0){
        // just return first instance
        return profiles[0]
      }
      return null
    }
    logger(`getPublicUserProfile: ${resp.status}: ${resp.statusText}`,'warn')
    return null
  }catch(e:any){
    logger(`getPublicUserProfile: ${e.message}`,'error')
    return null
  }
}
