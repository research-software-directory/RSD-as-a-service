// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {CommunityRequestStatus} from '~/components/communities/software/apiCommunitySoftware'
import {
  CommunitiesOfSoftware, getCommunitiesForSoftware, removeCommunityCategoriesFromSoftware,
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
    const removeCategoriesError = await removeCommunityCategoriesFromSoftware(software, community, token)
    if (removeCategoriesError) {
      showErrorMessage(`Failed to leave remove community categories: ${removeCategoriesError}`)
      return
    }

    // remove all community categories without waiting
    void removeCommunityCategoriesFromSoftware(software, community, token)

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
