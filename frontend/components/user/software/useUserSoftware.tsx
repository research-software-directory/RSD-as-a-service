// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type SoftwareByMaintainer={
  id:string ,
	slug:string,
	brand_name:string,
	short_statement:string,
	is_published:boolean,
	image_id:string|null
	updated_at:string,
	contributor_cnt:number,
	mention_cnt:number
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
    let url =`/api/v1/rpc/software_by_maintainer?maintainer_id=${account}&order=brand_name`
    // search
    if (searchFor) {
      url+=`&or=(brand_name.ilike.*${encodeURIComponent(searchFor)}*, short_statement.ilike.*${encodeURIComponent(searchFor)}*)`
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
