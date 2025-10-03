// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useContext, useState} from 'react'


import {setDocumentCookie} from '~/components/cookies/documentCookie'
import {SoftwareLayoutType} from '~/components/search/ToggleViewGroup'
import {rowsPerPageOptions} from './pagination'

export type UserSettingsProps={
  rsd_page_layout: SoftwareLayoutType,
  rsd_page_rows: number,
  avatar_id?: string | null
}

export type UserSettingsContextProps={
  user: UserSettingsProps,
  setUser:(user:UserSettingsProps)=>void
}

const defaultUserProps:UserSettingsProps={
  rsd_page_layout: 'grid',
  rsd_page_rows: rowsPerPageOptions[0],
  avatar_id: null
}


export const UserSettingsContext = createContext<UserSettingsContextProps>({
  user: defaultUserProps,
  setUser:()=>{}
})

export function UserSettingsProvider(props:any){
  const initUser={
    ...defaultUserProps,
    ...props?.user
  }
  const [user,setUser] = useState(initUser)

  // console.group('UserSettingsProvider')
  // console.log('props?.user...', props?.user)
  // console.log('initUser...', initUser)
  // console.log('user...', user)
  // console.groupEnd()

  return <UserSettingsContext.Provider
    value={{user,setUser}}
    {...props}
  />
}

export function useUserSettings(){
  const {user,setUser} = useContext(UserSettingsContext)

  function setPageLayout(layout:SoftwareLayoutType='grid'){
    // ignore null value - click on "same" button
    if (layout===null) return
    // console.log('layout...',layout)
    // save to cookie
    setDocumentCookie(layout,'rsd_page_layout')
    // save to state
    setUser({
      ...user,
      rsd_page_layout: layout
    })
  }

  function setPageRows(rows:number=12){
    // save to cookie
    setDocumentCookie(rows.toString(),'rsd_page_rows')
    // save to state
    setUser({
      ...user,
      rsd_page_rows: rows
    })
  }

  function setAvatarId(avatar_id:string|null){
    // save to state
    setUser({
      ...user,
      avatar_id
    })
  }

  return {
    ...user,
    setPageLayout,
    setPageRows,
    setAvatarId
  }
}

