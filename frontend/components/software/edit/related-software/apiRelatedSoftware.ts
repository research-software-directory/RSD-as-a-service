// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {SearchSoftware, SoftwareOverviewItemProps} from '../../../../types/SoftwareTypes'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '../../../../utils/fetchHelpers'
import logger from '../../../../utils/logger'

export async function getRelatedSoftwareForSoftware({software, token}:
{software: string, token?: string}) {
  try {
    const query = `rpc/related_software_for_software?software_id=${software}&is_published=eq.true`
    const order ='order=brand_name.asc'
    const url = `${getBaseUrl()}/${query}&${order}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: SoftwareOverviewItemProps[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      // no items found
      return []
    }
    logger(`getRelatedSoftwareForSoftware: ${resp.status} ${resp.statusText} [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getRelatedSoftwareForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function searchForRelatedSoftware({software, searchFor, token}: {
  software: string, searchFor:string, token?: string
}) {
  try {
    let query = `&brand_name=ilike.*${searchFor}*&is_published=eq.true&order=brand_name.asc&limit=50`
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
{origin: string, relation: string, token: string}) {

  const url = `/api/v1/software_for_software?origin=eq.${origin}&relation=eq.${relation}`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}
