// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {ApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {RsdContributor} from './useContributors'

type RawRsdContributor = Omit<RsdContributor,'avatar'> & {
  avatars_by_name: string[] | null
  avatars_by_orcid: string[] | null
}

export async function getContributors({page, rows, token, searchFor, orderBy}: ApiParams<RsdContributor, keyof RsdContributor>) {
  try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      const encodedSearch = encodeURIComponent(searchFor)
      query+=`&or=(given_names.ilike."*${encodedSearch}*",family_names.ilike."*${encodedSearch}*",email_address.ilike."*${encodedSearch}*",orcid.ilike."*${encodedSearch}*")`
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
      const json: RawRsdContributor[] = await resp.json()
      // aggregate avatars
      const contributors:RsdContributor[] = json.map(item=>{
        const avatars = [
          ...item.avatars_by_name ?? [],
        ]
        item.avatars_by_orcid?.forEach(avatar=>{
          if (avatars.includes(avatar)===false){
            avatars.push(avatar)
          }
        })
        return {
          ...item,
          avatars
        }
      })
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
    if (typeof origin === 'undefined') {
      return {
        status: 400,
        message: 'Property origin is missing'
      }
    }
    // convert empty string value to null
    if (value === '') value = null
    const url = `${getBaseUrl()}/${origin}?id=eq.${id}`
    // debugger
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
