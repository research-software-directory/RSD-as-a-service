// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {Session} from '~/auth'
import {OrganisationForOverview} from '~/types/Organisation'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type UserOrganisationProp = {
  searchFor?: string
  page: number,
  rows: number,
  session: Session
}

type State = {
  count: number,
  data: OrganisationForOverview[]
}

export async function getOrganisationsForMaintainer(
  {searchFor, page, rows, session}: UserOrganisationProp
) {
  try {
    // all top level organisations of maintainer
    const query=`maintainer_id=${session?.user?.account}&order=software_cnt.desc.nullslast,name`
    // baseUrl
    let url =`/api/v1/rpc/organisations_by_maintainer?${query}`

    // search
    if (searchFor) {
      url += `&name=ilike.*${searchFor}*`
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

    if ([200, 206].includes(resp.status)) {
      const data: OrganisationForOverview[] = await resp.json()
      const count = extractCountFromHeader(resp.headers) ?? 0
      return {
        count,
        data
      }
    }

    // otherwise request failed
    logger(`getOrganisationsForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')

    // we log and return zero
    return {
      count: 0,
      data: []
    }

  } catch (e: any) {
    // otherwise request failed
    logger(`getOrganisationsForMaintainer: ${e.message}`, 'error')

    // we log and return zero
    return {
      count: 0,
      data: []
    }
  }
}


export default function useUserOrganisations(
  {searchFor, page, rows, session}: UserOrganisationProp
) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getOrganisations() {
      // set loding done
      setLoading(true)

      const organisations: State = await getOrganisationsForMaintainer({
        searchFor,
        page,
        rows,
        session
      })

      // abort
      if (abort) {
        return
      }

      // set state
      setState(organisations)

      // set loding done
      setLoading(false)
    }

    if (session.token && session.user?.account) {
      getOrganisations()
    }

    return () => {abort = true}
  }, [searchFor, page, rows, session])

  return {
    organisations: state.data,
    count: state.count,
    loading
  }
}
