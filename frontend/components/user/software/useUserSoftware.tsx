// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type SoftwareByMaintainer={
  id:string ,
  slug:string,
  brand_name:string,
  short_statement:string,
  image_id:string|null
  is_published:boolean,
  updated_at:string,
  contributor_cnt:number,
  mention_cnt:number,
  keywords: string[] | null,
  prog_lang: string[] | null,
  licenses: string[] | null
}

export type UserSoftwareProp = {
  searchFor?: string
  page: number,
  rows: number,
  token?: string,
  account: string
}

export async function getSoftwareForMaintainer({
  searchFor, page, rows, account, token}:UserSoftwareProp
) {
  try {
    // baseUrl
    let url =`/api/v1/rpc/software_by_maintainer?maintainer_id=${account}`

    // search
    if (searchFor) {
      const encodedSearch = encodeURIComponent(searchFor)
      url+=`&or=(brand_name.ilike."*${encodedSearch}*", short_statement.ilike."*${encodedSearch}*")`
    }else{
      // default order by is_published
      url+='&order=is_published,brand_name'
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
    if ([200,206].includes(resp.status)) {
      const json: SoftwareByMaintainer[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        software: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      software:[]
    }

  } catch (e:any) {
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      software: []
    }
  }
}

type UseUserSoftwareProps={
  searchFor?: string
  page: number
  rows: number
}

type UserSoftware = {
  count: number,
  software: SoftwareByMaintainer[]
}

export default function useUserSoftware({searchFor,page,rows}:UseUserSoftwareProps) {
  const {user,token} = useSession()
  const [state, setState] = useState<UserSoftware>({
    count: 0,
    software: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getSoftware() {
      // set loading done
      // setLoading(true)
      const state:UserSoftware = await getSoftwareForMaintainer({
        searchFor,
        page,
        rows,
        token,
        account: user?.account ?? ''
      })
      // abort
      if (abort) return
      // set state
      setState(state)
      // set loading done
      setLoading(false)
    }

    if (token && user?.account) {
      getSoftware()
    }

    return ()=>{abort = true}

  },[searchFor,page,rows,token,user?.account])

  return {
    ...state,
    loading
  }
}
