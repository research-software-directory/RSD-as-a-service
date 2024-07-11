// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {CommunityRequestStatus} from '~/components/communities/software/apiCommunitySoftware'

export type CommunitiesOfSoftware = CommunityListProps & {
  status: CommunityRequestStatus
}

export async function getCommunitiesForSoftware({software,token}:{software:string,token:string}){
  try{
    const query = `rpc/communities_of_software?software_id=${software}&order=name.asc`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    if (resp.status === 200) {
      const json: CommunitiesOfSoftware[] = await resp.json()
      return json
    }

    // otherwise request failed
    logger(`getCommunitiesForSoftware: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  }catch(e:any){
    logger(`getCommunitiesForSoftware: ${e?.message}`, 'error')
    return []
  }
}

type RequestToJoinCommunity={
  software:string,
  community:string,
  token:string
}

export async function requestToJoinCommunity({software,community,token}:RequestToJoinCommunity){
  try{
    const url = `${getBaseUrl()}/software_for_community`

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token)
      },
      body:JSON.stringify({
        software,
        community
      })
    })

    return extractReturnMessage(resp,community)

  }catch(e:any){
    logger(`requestToJoinCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function removeCommunityCategoriesFromSoftware(softwareId: string, communityId: string, token: string): Promise<string | null> {
  const url = `${getBaseUrl()}/rpc/delete_community_categories_from_software`
  const body = JSON.stringify({software_id: softwareId, community_id: communityId})

  const resp = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return resp.ok ? null : resp.text()
}

export async function removeSoftwareFromCommunity({software,community,token}:RequestToJoinCommunity){
  try{
    if (software && community){
      const query = `software=eq.${software}&community=eq.${community}`
      const url = `${getBaseUrl()}/software_for_community?${query}`

      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...createJsonHeaders(token)
        },
        body:JSON.stringify({
          software,
          community
        })
      })
      return extractReturnMessage(resp,community)
    }else{
      return {
        status: 400,
        message: 'Missing software OR community id'
      }
    }
  }catch(e:any){
    logger(`requestToJoinCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
