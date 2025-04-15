// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useCallback, useContext, useState} from 'react'

import {LoginForAccount} from '~/components/user/settings/profile/apiLoginForAccount'
import {UserProfile} from '~/components/user/settings/profile/apiUserProfile'

export type UserCounts = {
  software_cnt: number
  project_cnt: number
  organisation_cnt: number
  community_cnt: number
}

type UserContextProps={
  orcidAuthLink: string|null
  linkedInAuthLink: string|null
  counts: UserCounts
  profile: UserProfile
  logins: LoginForAccount[]
  updateUserProfile: ({key,value}:{key:keyof UserProfile,value:any})=>void
  removeLogin: (id:string)=>void
}

// create context
const UserContext = createContext<UserContextProps|null>(null)

// profile context provider
export function UserContextProvider(props:any){
  const [profile, setProfile] = useState<UserProfile>(props?.profile)
  const [counts] = useState<UserCounts>(props?.counts)
  const [logins, setLogins] = useState<LoginForAccount[]>(props?.logins)
  const [orcidAuthLink] = useState<string|null>(props?.orcidAuthLink)
  const [linkedInAuthLink] = useState<string|null>(props?.linkedInAuthLink)

  const updateUserProfile = useCallback(({key,value}:{key:keyof UserProfile,value:any})=>{
    setProfile((data)=>{
      const newProfile = {
        ...data,
        [key]: value
      }
      return newProfile
    })
  },[])

  const removeLogin = useCallback((id:string)=>{
    // remove item from list by id
    setLogins ((logins)=>{
      const newList = logins.filter(login=>login.id!==id)
      return newList
    })
  },[])

  return <UserContext.Provider
    // ignore SONAR warning -> the values use useState hook already
    value={{counts,orcidAuthLink,linkedInAuthLink,logins,profile,updateUserProfile,removeLogin}} // NOSONAR
    {...props}
  />
}

// user profile context hook
export function useUserContext(){
  const props = useContext(UserContext)
  if (props===null){
    throw Error('useUserContext requires UserContext at parent')
  }
  return props
}

export default UserContext
