// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Status} from '~/types/Organisation'
import {RelatedSoftwareOfSoftware, RelatedTools, SearchSoftware} from '../types/SoftwareTypes'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import logger from './logger'

export async function getRelatedToolsForSoftware({software, token, frontend}:
  { software: string, token?: string, frontend?: boolean}) {
  try {
    // limited colums selection of software table
    const columns = 'id,slug,brand_name,short_statement,is_featured,updated_at'
    // join with software_for_software table
    const select = `origin,relation,software!software_for_software_relation_fkey(${columns})`
    let url = `${process.env.POSTGREST_URL}/software_for_software?select=${select}&origin=eq.${software}`
    if (frontend) {
      url = `/api/v1/software_for_software?select=${select}&origin=eq.${software}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const json: RelatedTools[] = await resp.json()
      const data: RelatedSoftwareOfSoftware[] = json.map(item => ({
        ...item.software,
        // status defaults to approved
        status: 'approved' as Status
      }))
      return data
    } else if (resp.status === 404) {
      // no items found
      return []
    }
    logger(`getRelatedToolsForSoftware: ${resp.status} ${resp.statusText}`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getRelatedToolsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function searchForRelatedSoftware({software, searchFor, token}: {
  software: string, searchFor:string, token?: string
}) {
  try {
    let query = `&brand_name=ilike.*${searchFor}*&order=brand_name.asc&limit=50`
    // software item to exclude
    if (software) {
      query += `&id=neq.${software}`
    }
    const url = `/api/v1/software?select=id,slug,brand_name,short_statement${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: SearchSoftware[] = await resp.json()
      return json
    } else {
      return []
    }
  } catch (e: any) {
    logger(`searchForRelatedSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function addRelatedSoftware({origin,relation, token}: {
  origin:string,relation:string, token:string
}) {
  const url = '/api/v1/software_for_software'

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      origin,
      relation
    })
  })

  return extractReturnMessage(resp)
}

export async function deleteRelatedSoftware({origin, relation, token}:
  { origin: string, relation: string, token: string }) {

  const url = `/api/v1/software_for_software?origin=eq.${origin}&relation=eq.${relation}`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}
