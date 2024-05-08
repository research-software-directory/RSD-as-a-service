// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {PropsWithChildren, createContext, useCallback, useContext, useState} from 'react'
import {Community} from '~/components/admin/communities/apiCommunities'
import {CommunityListProps} from '~/components/communities/apiCommunities'

type UpdateCommunityProps = {
  key: keyof Community,
  value: any
}

type CommunityContextProps = PropsWithChildren & {
  community: CommunityListProps | null,
  isMaintainer: boolean,
  updateCommunity: ({key,value}:UpdateCommunityProps)=>void
}

const CommunityContext = createContext<CommunityContextProps>({
  community: null,
  isMaintainer: false,
  updateCommunity: ({key,value}:UpdateCommunityProps)=> {}
})

export function CommunityProvider({community:initCommunity,isMaintainer:initMaintainer,...props}:any){
  const [community, setCommunity] = useState(initCommunity)
  const [isMaintainer] = useState<boolean>(initMaintainer ?? false)

  const updateCommunity = useCallback(({key,value}:UpdateCommunityProps)=>{
    if (community){
      const comm = {
        ...community,
        [key]:value
      }
      setCommunity(comm)
    }
  },[community])

  return (
    <CommunityContext.Provider value={{
      community,
      isMaintainer,
      updateCommunity
    }}
    {...props} />
  )
}

export function useCommunityContext(){
  const {community,isMaintainer,updateCommunity} = useContext(CommunityContext)
  return {
    ...community,
    isMaintainer,
    updateCommunity
  }
}
