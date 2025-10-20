// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {OrganisationForOverview} from '~/types/Organisation'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type UserOrganisationProp = {
  searchFor?: string
  page: number,
  rows: number,
  token?: string,
  account: string
}

export async function getOrganisationsForMaintainer(
  {searchFor, page, rows, token, account}: UserOrganisationProp
) {
  try {
    // all top level organisations of maintainer
    const query=`maintainer_id=${account}&order=software_cnt.desc.nullslast,name`
    // baseUrl
    let url =`${getBaseUrl()}/rpc/organisations_by_maintainer?${query}`

    // search
    if (searchFor) {
      const encodedSearch = encodeURIComponent(searchFor)
      url += `&or=(name.ilike."*${encodedSearch}*",short_description.ilike."*${encodedSearch}*")`
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
      const organisations: OrganisationForOverview[] = await resp.json()
      const count = extractCountFromHeader(resp.headers) ?? 0
      return {
        count,
        organisations
      }
    }

    // otherwise request failed
    logger(`getOrganisationsForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')

    // we log and return zero
    return {
      count: 0,
      organisations: []
    }

  } catch (e: any) {
    // otherwise request failed
    logger(`getOrganisationsForMaintainer: ${e.message}`, 'error')

    // we log and return zero
    return {
      count: 0,
      organisations: []
    }
  }
}

type UseUserOrganisationsProps={
  searchFor?: string
  page: number
  rows: number
}

type UserOrganisations = {
  count: number,
  organisations: OrganisationForOverview[]
}

export default function useUserOrganisations({searchFor,page,rows}:UseUserOrganisationsProps) {
  const {user,token} = useSession()
  const [state, setState] = useState<UserOrganisations>({
    count: 0,
    organisations: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getOrganisations() {
      const organisations = await getOrganisationsForMaintainer({
        searchFor,
        page,
        rows,
        token,
        account: user?.account ?? ''
      })
      // abort
      if (abort) return
      // set state
      setState(organisations)
      // set loading done
      setLoading(false)
    }

    if (token && user?.account) {
      getOrganisations()
    }

    return () => {abort = true}

  }, [searchFor, page, rows, token, user?.account])

  return {
    ...state,
    loading
  }
}
