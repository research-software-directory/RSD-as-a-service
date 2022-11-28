// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../types/AutocompleteOptions'
import {SearchPerson} from '../types/Contributor'
import {createJsonHeaders} from './fetchHelpers'
import {getDisplayName} from './getDisplayName'
import logger from './logger'
import {sortOnStrProp} from './sortFn'

const exampleResponse = {
  'orcid-id': '0000-0001-6067-6529',
  'given-names': 'Dusan',
  'family-names': 'Pejakovic',
  'credit-name': null,
  'other-name': [],
  'email': [],
  'institution-name': [
    'Gordon and Betty Moore Foundation',
    'SRI International',
    'The Ohio State University'
  ]
}

export type OrcidRecord = typeof exampleResponse

const baseUrl = 'https://pub.orcid.org/v3.0/expanded-search/'
const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/

export function isOrcid(stringToCheck: string): boolean {
  return stringToCheck.match(orcidRegex) !== null
}

export async function getORCID({searchFor}: { searchFor: string }) {
  try {
    const rows = '&start=0&rows=50'
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
      const json:any = await resp.json()
      const options = buildAutocompleteOptions(json['expanded-result'])
      // debugger
      return options
    }
    logger(`getORCID FAILED: ${resp.status}: ${resp.statusText}`,'warn')
    // we return nothing
    return []
  } catch (e: any) {
    logger(`getORCID: ${e?.message}`, 'error')
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


function buildAutocompleteOptions(data: OrcidRecord[]): AutocompleteOption<SearchPerson>[]{
  if (!data) return []

  const options = data.map(item => {
    const display_name = getDisplayName({
      given_names: item['given-names'],
      family_names: item['family-names']
    })
    return {
      key: item['orcid-id'],
      label: display_name ?? '',
      data: {
        given_names: item['given-names'],
        family_names: item['family-names'],
        email_address: item['email'][0] ?? null,
        institution: item['institution-name'] ?? null,
        orcid: item['orcid-id'],
        display_name,
        source: 'ORCID' as 'ORCID'
      }
    }
  })
  return options.sort((a,b)=>sortOnStrProp(a,b,'label'))
}

