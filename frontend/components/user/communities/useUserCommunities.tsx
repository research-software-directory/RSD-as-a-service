// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {useSession} from '~/auth'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

type UserCommunitiesProps={
  searchFor: string
  page: number
  rows: number
}

type GetCommunitiesProps = UserCommunitiesProps & {
  token: string
  account: string
}

export async function getCommunitiesForMaintainer({searchFor,page,rows,account,token}:GetCommunitiesProps){
  try{
    // all top level communities of maintainer
    const query=`maintainer_id=${account}&order=software_cnt.desc.nullslast,name`
    // baseUrl
    let url =`${getBaseUrl()}/rpc/communities_by_maintainer?${query}`
    // search
    if (searchFor) {
      url += `&name=ilike.*${searchFor}*`
    }
    // pagination
    url += paginationUrlParams({rows, page})

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200, 206].includes(resp.status)) {
      const items: CommunityListProps[] = await resp.json()
      const count = extractCountFromHeader(resp.headers) ?? 0
      return {
        count,
        items
      }
    }

    // otherwise request failed
    logger(`getCommunitiesForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')

    // we log and return zero
    return {
      count: 0,
      items: []
    }

  }catch(e:any){
    // otherwise request failed
    logger(`getCommunitiesForMaintainer: ${e.message}`, 'error')

    // we log and return zero
    return {
      count: 0,
      items: []
    }
  }
}


export default function useUserCommunities(){
  const {user,token} = useSession()
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Filter communities')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    count: number,
    items: CommunityListProps[]
  }>({
    count: 0,
    items: []
  })

  useEffect(()=>{

    if (user?.account){

      getCommunitiesForMaintainer({
        searchFor, page,rows,account:user?.account,token
      })
        .then(data=>{
          setData(data)
          setCount(data.count)
        })
        .finally(()=>{
          setLoading(false)
        })
    }
  // ignore setCount dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token,user?.account])

  return {
    loading,
    communities: data.items
  }
}
