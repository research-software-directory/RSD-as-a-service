// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {Session} from '~/auth'
import {SoftwareOfOrganisation} from '~/types/Organisation'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

type UserSoftwareProp = {
  searchFor?: string
  page: number,
  rows: number,
  session: Session
}

type State = {
  count: number,
  data: SoftwareOfOrganisation[]
}

export async function getSoftwareForMaintainer({searchFor, page, rows, session}:
  UserSoftwareProp) {
  try {
    // baseUrl
    let url =`/api/v1/rpc/software_by_maintainer?maintainer_id=${session?.user?.account}&order=brand_name`
    // search
    if (searchFor) {
      url+=`&or=(brand_name.ilike.*${searchFor}*, short_statement.ilike.*${searchFor}*)`
    }
    // pagination
    url += paginationUrlParams({rows, page})
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(session.token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })
    if ([200,206].includes(resp.status)) {
      const json: SoftwareOfOrganisation[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        data: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data:[]
    }

  } catch (e:any) {
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  }
}


export default function useUserSoftware({searchFor, page, rows, session}:
  UserSoftwareProp) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getSoftware() {
      // set loding done
      setLoading(true)
      const software:State = await getSoftwareForMaintainer({
        searchFor,
        page,
        rows,
        session
      })
      // abort
      if (abort) return
      // set state
      setState(software)
      // set loding done
      setLoading(false)
    }

    if (session.token && session.user?.account) {
      getSoftware()
    }

    return ()=>{abort = true}
  },[searchFor,page,rows,session])

  return {
    software:state.data,
    count:state.count,
    loading
  }
}
