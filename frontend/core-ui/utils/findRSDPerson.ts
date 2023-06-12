// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {SearchPerson} from '~/types/Contributor'
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

// DISABLED 28-3-2023
// export async function findRSDPerson({searchFor, token, frontend}:
//   { searchFor: string, token?: string, frontend?: boolean }) {
//   try {
//     // we search for all persons in RSD (contributors + team members)
//     let url = `${getBaseUrl()}/rpc/unique_persons?limit=20`

//     if (isOrcid(searchFor)) {
//       url = url + `&orcid=eq.${searchFor}`
//     } else {
//       url = url + `&display_name=ilike.*${searchFor}*`
//     }

//     const resp = await fetch(url, {
//       method: 'GET',
//       headers: {
//         ...createJsonHeaders(token),
//       }
//     })

//     if (resp.status === 200) {
//       const data: SearchPerson[] = await resp.json()
//       const options: AutocompleteOption<SearchPerson>[] = data.map(item => {
//         return {
//           key: item.display_name ?? '',
//           label: item.display_name ?? '',
//           data: {
//             ...item,
//             source: 'RSD'
//           }
//         }
//       })
//       return options
//     } else if (resp.status === 404) {
//       logger('findRSDPerson ERROR: 404 Not found', 'error')
//       // query not found
//       return []
//     }
//     logger(`findRSDPerson ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
//     return []
//   } catch (e: any) {
//     logger(`findRSDPerson: ${e?.message}`, 'error')
//     return []
//   }
// }

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
