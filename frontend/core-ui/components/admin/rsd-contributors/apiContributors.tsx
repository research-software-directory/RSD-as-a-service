// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {ApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {OrderByProps} from '~/components/table/EditableTable'
import {createColumns} from './config'

export type RsdContributor = {
  id: string,
  is_contact_person: boolean
  email_address: string
  family_names: string
  given_names: string
  affiliation: string
  role: string
  orcid: string
  avatar_id: string
  origin: 'contributor' | 'team_member'
  slug: string
}

type useContributorsProps = {
  token: string,
  orderBy?: OrderByProps<RsdContributor, keyof RsdContributor>
}

export function useContributors({token, orderBy}:useContributorsProps) {
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find contributor')
  const [contributors, setContributors] = useState<RsdContributor[]>([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(createColumns(token))

  const loadContributors = useCallback(async () => {
    let abort = false
    setLoading(true)
    const {contributors, count} = await getContributors({
      token,
      searchFor,
      page,
      rows,
      orderBy
    })

    if (abort === false) {
      if (orderBy) {
        columns.forEach(col => {
          if (col.key === orderBy.column) {
            col.order = {
              active: true,
              direction: orderBy.direction
            }
          } else {
            col.order = {
              active: false,
              direction: 'asc'
            }
          }
        })
        // update columns order
        setColumns(columns)
      }
      setContributors(contributors)
      setCount(count)
      setLoading(false)
    }

    return ()=>{abort=true}
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows, columns, orderBy])

  useEffect(() => {
    loadContributors()
  },[loadContributors])

  return {
    loading,
    columns,
    contributors
  }
}


async function getContributors({page, rows, token, searchFor, orderBy}: ApiParams<RsdContributor, keyof RsdContributor>) {
   try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(given_names.ilike.*${searchFor}*,family_names.ilike.*${searchFor}*,email_address.ilike.*${searchFor}*,orcid.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy.column}.${orderBy.direction}`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/person_mentions?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const contributors: RsdContributor[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        contributors
      }
    }
    logger(`getContributors: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      contributors: []
    }
  } catch (e: any) {
    logger(`getContributors: ${e.message}`,'error')
    return {
      count: 0,
      contributors: []
    }
  }
}

export async function patchPerson({id, key, value, origin, token}: {
  id:string, key:string, value:any, origin?:string, token:string
}) {
  try {
    // const url = `/api/v1/contributor?id=eq.${id}`
    if (typeof origin === 'undefined') {
      return {
        status: 400,
        message: 'Property origin is missing'
      }
    }
    const url = `/api/v1/${origin}?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify({
        [key]: value
      })
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchPerson: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
