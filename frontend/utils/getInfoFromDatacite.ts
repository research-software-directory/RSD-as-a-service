// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {Contributor} from '~/types/Contributor'
import {createJsonHeaders} from './fetchHelpers'
import {itemsNotInReferenceList} from './itemsNotInReferenceList'
import logger from './logger'

const exampleCreator = {
  'name': 'Doe, John',
  'nameType': 'Personal',
  'givenName': 'John',
  'familyName': 'Doe',
  'affiliation': [
    {
      'name': 'Example organisation'
    }
  ],
  'nameIdentifiers': [
    {
      'schemeUri': 'https://orcid.org',
      'nameIdentifier': 'https://orcid.org/0000-0000-0000-0000',
      'nameIdentifierScheme': 'ORCID'
    }
  ]
}

const exampleSubject = {
  'subject': '000 computer science',
  'subjectScheme': 'dewey',
  'valueURI': 'https://cern.ch',
  'schemeURI': 'http://dewey.info/',
  'lang': 'en-us'
}

const exampleRightsList = [
  {
    'rights': 'Open Access',
    'rightsUri': 'info:eu-repo/semantics/openAccess',
    'schemeUri': 'https://spdx.org/licenses/',
    'rightsIdentifier': 'cc-by-4.0',
    'rightsIdentifierScheme': 'SPDX'
  }
]

const exampleResponse = {
  'id': 'https://doi.org/10.0000/zenodo.0000000',
  'doi': '10.0000/ZENODO.0000000',
  'url': 'https://zenodo.org/record/0000000',
  'types': {
    'ris': 'COMP',
    'bibtex': 'misc',
    'citeproc': 'article',
    'schemaOrg': 'SoftwareSourceCode',
    'resourceTypeGeneral': 'Software'
  },
  'creators': [
    exampleCreator,
  ],
  'titles': [
    {
      'title': 'Example Title v0.0.0'
    }
  ],
  'publisher': 'Zenodo',
  'container': {},
  'contributors': [],
  'dates': [
    {
      'date': '2021-10-16',
      'dateType': 'Issued'
    }
  ],
  'publicationYear': 2021,
  'subjects': [
    exampleSubject
  ],
  'identifiers': [
    {
      'identifier': 'https://zenodo.org/record/0000000',
      'identifierType': 'URL'
    }
  ],
  'sizes': [
    '8461 Bytes'
  ],
  'formats': [],
  'version': 'v0.0.0',
  'rightsList': exampleRightsList,
  'descriptions': [
    {
      'description': 'Example description',
      'descriptionType': 'Abstract',
    }
  ],
  'geoLocations': [],
  'fundingReferences': [],
  'relatedIdentifiers': [
    {
      'relationType': 'IsSupplementTo',
      'relatedIdentifier': 'https://github.com/github/software/tree/v0.0.0',
      'relatedIdentifierType': 'URL'
    },
  ],
  'relatedItems': [],
  'schemaVersion': 'http://datacite.org/schema/kernel-4',
  'providerId': 'cern',
  'clientId': 'cern.zenodo',
  'agency': 'datacite',
  'state': 'findable'
}

export type DataciteRecord = typeof exampleResponse
export type DatacitePerson = typeof exampleCreator
export type DataciteSubject = typeof exampleSubject
export type DataciteRightsList = typeof exampleRightsList

const baseUrl = 'https://api.datacite.org/application/vnd.datacite.datacite+json/'
const orcidPattern = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/
const orcidUrlPattern = /^https?\:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/

export async function getDoiInfo(doiId: string) {
  try {
    const url = `${baseUrl}${doiId}`

    // make request
    const resp = await fetch(url, {
      headers: {
        // pass json request in the header
        ...createJsonHeaders(undefined),
      }
    })

    if (resp.status === 200) {
      const json: DataciteRecord[] = await resp.json()
      return json
    }

    logger(`getting DOI info FAILED: ${resp.status}: ${resp.statusText}`,'warn')
    return null
  } catch (e: any) {
    logger(`getting DOI info: ${e?.message}`, 'error')
    return null
  }
}

export async function getContributorsFromDoi(
  softwareId: string, doiId: string
) {
  if (doiId==='' || softwareId==='') {
    return []
  }

  const doiData = await getDoiInfo(doiId)

  if (!doiData) {
    return []
  }

  const contributors: Contributor[] = []
  let allPersons: DatacitePerson[] = []

  if ('creators' in doiData) {
    allPersons = doiData['creators'] as any
  }

  if ('contributors' in doiData) {
    const contributors = itemsNotInReferenceList({
      list: doiData['contributors'] as any,
      referenceList: allPersons,
      key: 'name'
    })
    allPersons = [
      ...allPersons,
      ...contributors
    ]
  }

  for (const person of allPersons) {
    const affiliation = person.affiliation
    const nameIds = person.nameIdentifiers
    let useAffiliation = ''
    let useOrcid = ''

    // check minimum needed attributes
    if (!('givenName' in person) || !('familyName' in person)) {
      continue
    }

    if (affiliation && affiliation.length > 0) {
      const first = affiliation[0]

      // DataCite schema says "free text", but API returns "name" attribute
      if (typeof(first) === 'string') {
        useAffiliation = first
      } else if (typeof(first) === 'object' && 'name' in first) {
        useAffiliation = first.name
      }
    }

    if (nameIds && nameIds.length > 0) {
      for (const id of nameIds) {
        if (id.nameIdentifierScheme !== 'ORCID') {
          continue
        }

        if (id.nameIdentifier.match(orcidUrlPattern) !== null) {
          const l = id.nameIdentifier.length
          useOrcid = id.nameIdentifier.substring(l - 19, l)
          break
        }

        if (id.nameIdentifier.match(orcidPattern) !== null) {
          useOrcid = id.nameIdentifier
          break
        }
      }
    }

    contributors.push({
      given_names: person.givenName,
      family_names: person.familyName,
      email_address: '',
      software: softwareId,
      affiliation: useAffiliation,
      is_contact_person: false,
      orcid: useOrcid,
      position: null,
      id: null,
      role: null,
      avatar_id: null
    })
  }

  return contributors
}

export async function getKeywordsFromDoi(doiId: string | null | undefined) {
  if (!doiId) {
    return []
  }

  const doiData = await getDoiInfo(doiId)

  if (!doiData || !('subjects' in doiData)) {
    return []
  }

  const allSubjects: DataciteSubject[] = doiData['subjects'] as any
  const keywords = []

  for (const subject of allSubjects) {
    if ('subject' in subject && subject.subject.length > 0) {
      keywords.push(subject.subject)
    }
  }

  return keywords
}

export async function getLicensesFromDoi(doiId: string | null | undefined) {
  if (!doiId) {
    return []
  }

  const doiData = await getDoiInfo(doiId)

  if (!doiData || !('rightsList' in doiData)) {
    return []
  }

  const allLicenses: DataciteRightsList = doiData['rightsList'] as any
  const spdxLicenses = []

  for (const license of allLicenses) {
    // use identifier if present
    if (license.rightsIdentifier) {
      spdxLicenses.push(license.rightsIdentifier)
    } else if (license.rights) {
      spdxLicenses.push(license.rights)
    }
  }

  return spdxLicenses
}
