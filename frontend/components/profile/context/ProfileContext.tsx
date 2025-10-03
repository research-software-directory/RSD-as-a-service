// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {createContext, useCallback, useContext, useState} from 'react'

type ProfileContextProps={
  count:{
    software_cnt: number,
    project_cnt: number,
  }
  setCount:(val:any)=>void
}

// create context
const ProfileContext = createContext<ProfileContextProps>({
  count:{
    software_cnt:0,
    project_cnt:0
  },
  setCount:()=>{}
})

// profile context provider
export function ProfileContextProvider(props:any){
  const [count,setCount] = useState({
    software_cnt: props?.software_cnt as number ?? 0,
    project_cnt: props?.project_cnt as number ?? 0
  })
  return <ProfileContext.Provider
    value={{count,setCount}} // NOSONAR - this object should be refreshed on every render
    {...props}
  />
}

// profile context hook
export function useProfileContext(){
  const {count,setCount} = useContext(ProfileContext)

  const setSoftwareCnt = useCallback((cnt:number)=>{
    setCount((data:any)=>{
      return {
        ...data,
        software_cnt: cnt
      }
    })

  },[setCount])

  const setProjectCnt = useCallback((cnt:number)=>{
    setCount((data:any)=>{
      return {
        ...data,
        project_cnt: cnt
      }
    })

  },[setCount])

  return {
    ...count,
    setSoftwareCnt,
    setProjectCnt
  }
}

export default ProfileContext
