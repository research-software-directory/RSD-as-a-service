// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from './fetchHelpers'
import {isOrcid} from './getORCID'
import logger from './logger'

export type UniqueRsdPerson = {
  avatar_id:string | null
  orcid: string | null,
  given_names:string,
  family_names:string,
  email_address: string | null,
  affiliation: string | null,
  role: string | null,
  display_name: string,
}

export async function rsdUniquePersonEntries({searchFor, token}:
  { searchFor: string, token?: string}) {
  try {
    // we search for all persons in RSD (contributors + team members)
    let url = `${getBaseUrl()}/rpc/unique_person_entries?limit=50`

    if (isOrcid(searchFor)) {
      url = url + `&orcid=eq.${searchFor}`
    } else {
      url = url + `&display_name=ilike.*${searchFor}*`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: UniqueRsdPerson[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger('findRSDPerson ERROR: 404 Not found', 'error')
      // query not found
      return []
    }
    logger(`findRSDPerson ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []
  } catch (e: any) {
    logger(`findRSDPerson: ${e?.message}`, 'error')
    return []
  }
}
