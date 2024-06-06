// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {CommunityRequestStatus} from '~/components/communities/software/apiCommunitySoftware'
import {
  CommunitiesOfSoftware, getCommunitiesForSoftware,
  removeSoftwareFromCommunity, requestToJoinCommunity
} from './apiSoftwareCommunities'

export function useSoftwareCommunities(software:string){
  const {token} = useSession()
  const [loading,setLoading] = useState(true)
  const [communities,setCommunities] = useState<CommunitiesOfSoftware[]>([])
  const {showErrorMessage} = useSnackbar()

  useEffect(()=>{
    if (software && token){
      getCommunitiesForSoftware({
        software,
        token
      })
        .then(data=>{
          setCommunities(data)
        })
        .finally(()=>setLoading(false))
    }
  },[software,token])

  const joinCommunity = useCallback(async({software,community}:{software:string,community:CommunityListProps})=>{
    const resp = await requestToJoinCommunity({
      software,
      community:community.id,
      token
    })
    // update if added
    if (resp.status===200){
      setCommunities((data)=>{
        return [
          ...data,
          {
            ...community,
            status: 'pending' as CommunityRequestStatus
          }
        ]
      })
    } else {
      showErrorMessage(`Failed to join community ${community.name}. ${resp.message}`)
    }
  // ignore showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  const leaveCommunity = useCallback(async({software,community}:{software:string,community:string})=>{
    const resp = await removeSoftwareFromCommunity({
      software,
      community,
      token
    })
    // update if deleted
    if (resp.status===200){
      setCommunities((data)=>{
        const newData = data.filter(item=>item.id!==community)
        return newData
      })
    } else {
      showErrorMessage(`Failed to leave community. ${resp.message}`)
    }
  // ignore showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  return{
    communities,
    loading,
    joinCommunity,
    leaveCommunity
  }
}
