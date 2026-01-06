// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders} from './fetchHelpers'
import logger from './logger'

export type OrcidRecord = {
  'orcid-id': string,
  'given-names': string,
  'family-names': string,
  'other-name': string[],
  'email': string[],
  'institution-name': string[]
}

type OrcidExpandedSearchResponse = {
  'expanded-result': OrcidRecord[]
  'num-found': number
}

const baseUrl = 'https://pub.orcid.org/v3.0/expanded-search/'
export const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/

export function isOrcid(stringToCheck: string): boolean {
  return stringToCheck.match(orcidRegex) !== null
}

export async function searchORCID({searchFor, limit=30}: {searchFor: string, limit?:number}) {
  try {
    const rows = `&start=0&rows=${limit}`
    const query = buildSearchQuery(searchFor)
    const url = `${baseUrl}?${query}${rows}`
    // make request
    const resp = await fetch(url, {
      headers: {
        // pass json request in the header
        ...createJsonHeaders(undefined),
      }
    })

    if (resp.status === 200) {
      const json: OrcidExpandedSearchResponse = await resp.json()
      if (json['num-found']===0) return []
      return json['expanded-result']
    }
    logger(`searchORCID FAILED: ${resp.status}: ${resp.statusText}`, 'warn')
    // we return nothing
    return []
  } catch (e: any) {
    logger(`searchORCID: ${e?.message}`, 'error')
    return []
  }
}

function buildSearchQuery(searchFor: string) {
  if (isOrcid(searchFor)) {
    return `q=orcid:${searchFor}`
  }
  const names = searchFor.split(' ')
  const given_names = names[0]
  const family_names = names.length > 1 ? names.slice(1).join(' ') : null
  if (family_names) {
    return `q=given-names:${given_names}+AND+family-name:${family_names}*`
  }
  // just try the term on both
  return `q=given-names:${searchFor}*+OR+family-name:${searchFor}*`
}
