// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {Contributor} from '~/types/Contributor'
import {createJsonHeaders} from './fetchHelpers'
import {itemsNotInReferenceList} from './itemsNotInReferenceList'
import logger from './logger'
import {splitName} from './getDisplayName'

// use example response for types
import dataciteItem from './__mocks__/dataciteItem.json'
export type DataciteRecord = typeof dataciteItem
export type DatacitePerson = typeof dataciteItem.creators[0]

const baseUrl = 'https://api.datacite.org/application/vnd.datacite.datacite+json/'

async function getDoiInfo(doiId: string) {
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
      const json: DataciteRecord = await resp.json()
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
  const contributors: Contributor[] = []
  const allPersons: DatacitePerson[] = []

  if (doiId==='' || softwareId==='') {
    return []
  }

  const doiData = await getDoiInfo(doiId)

  if (doiData===null) {
    return []
  }

  if (doiData?.creators?.length > 0) {
    // extract persons from creators
    const creators = doiData.creators
    creators.forEach(item=>{
      allPersons.push(item)
    })
  }

  if (doiData?.contributors?.length > 0) {
    // extract unique persons from contributors
    itemsNotInReferenceList({
      list: doiData['contributors'],
      referenceList: allPersons,
      key: 'name'
    }).forEach(item=>{
      allPersons.push(item)
    })
  }
  // convert DOI creators and contributors into RSD contributor format
  allPersons.forEach(person=>{
    let given_names:string|null=null,
      family_names:string|null=null,
      affiliation:string|null=null,
      orcid:string|null=null

    // use first affiliation
    if (person?.affiliation?.length > 0) {
      const first = person?.affiliation[0]
      // DataCite schema says "free text", but API returns "name" attribute
      if (typeof(person?.affiliation[0]) === 'string') {
        affiliation = person?.affiliation[0]
      } else if (typeof(first) === 'object' && 'name' in first) {
        affiliation = person?.affiliation[0].name
      }
    }

    // extract ORCID
    if (person?.nameIdentifiers?.length > 0) {
      person?.nameIdentifiers.forEach(id=>{
        if (id.nameIdentifierScheme === 'ORCID'){
          if (id.nameIdentifier.startsWith('https://orcid.org/')===true){
            orcid = id.nameIdentifier.replace('https://orcid.org/','')
          }else {
            orcid = id.nameIdentifier
          }
        }
      })
    }

    // check minimum needed attributes
    if (person.hasOwnProperty('givenName')===true && person.hasOwnProperty('familyName')===true){
      given_names = person.givenName
      family_names = person.familyName
    }else if (person.hasOwnProperty('name')===true){
      // if no givenName & familyName we can use name
      if (person.name.includes(' ')===true){
        // we split by space
        const names = splitName(person.name)
        given_names = names.given_names
        family_names = names.family_names
      } else if (person.name.includes('-')===true){
        // if we can split by - we use that
        const split = person.name.split('-')
        given_names = split[0]
        family_names = split.splice(1).join(' ')
      }
    }
    // if we have name props we can add contributor
    if (given_names && family_names){
      // add contributor
      contributors.push({
        given_names,
        family_names,
        email_address: null,
        software: softwareId,
        affiliation,
        is_contact_person: false,
        orcid,
        position: null,
        id: null,
        role: null,
        avatar_id: null,
        account: null
      })
    }
  })

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

  const allSubjects = doiData['subjects']
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

  const allLicenses = doiData['rightsList']
  const spdxLicenses = []

  for (const license of allLicenses) {
    // use identifier if present
    if (license?.rightsIdentifierScheme?.toLowerCase()==='spdx'){
      spdxLicenses.push({
        key: license?.rightsIdentifier ?? null,
        name: license?.rights ?? null,
        reference: license?.rightsUri ?? null
      })
    // use only if it has http link
    } else if (license?.rightsUri?.startsWith('http')===true){
      spdxLicenses.push({
        key: license?.rightsIdentifier ?? null,
        name: license?.rights ?? null,
        reference: license?.rightsUri ?? null
      })
    }
  }

  return spdxLicenses
}
