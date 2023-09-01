// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {ApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {RsdContributor} from './useContributors'

export async function getContributors({page, rows, token, searchFor, orderBy}: ApiParams<RsdContributor, keyof RsdContributor>) {
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
