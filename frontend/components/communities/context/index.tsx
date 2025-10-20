// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {PropsWithChildren, createContext, useCallback, useContext, useEffect, useState} from 'react'
import {EditCommunityProps} from '~/components/communities/apiCommunities'

type UpdateCommunityProps = {
  key: keyof EditCommunityProps,
  value: any
}

type CommunityContextProps = PropsWithChildren & {
  community: EditCommunityProps,
  isMaintainer: boolean,
  updateCommunity: ({key,value}:UpdateCommunityProps)=>void
}

const emptyCommunity:EditCommunityProps = {
  id:'',
  name: '',
  slug: '',
  short_description: null,
  description: null,
  website: null,
  primary_maintainer: null,
  logo_id: null,
  software_cnt: null,
  pending_cnt: null,
  rejected_cnt: null,
  keywords: [],
}

const CommunityContext = createContext<CommunityContextProps>({
  community: emptyCommunity,
  isMaintainer: false,
  updateCommunity: () => {}
})

export function CommunityProvider({community:initCommunity,isMaintainer:initMaintainer,...props}:any){
  const [community, setCommunity] = useState(initCommunity)
  const [isMaintainer] = useState<boolean>(initMaintainer ?? false)

  useEffect(() => {
    setCommunity(initCommunity)
  }, [initCommunity])

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
    community,
    isMaintainer,
    updateCommunity
  }
}
