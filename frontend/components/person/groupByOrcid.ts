// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {SourceType} from '~/types/Contributor'
import {getDisplayName} from '~/utils/getDisplayName'
import {OrcidRecord} from '~/utils/getORCID'
import {UniqueRsdPerson} from './findRSDPerson'

export type AggregatedPerson = {
  account: string | null
  orcid: string | null
  display_name: string
  given_names: string
  family_names: string
  email_options: string[]
  role_options: string[]
  affiliation_options: string[]
  avatar_options: string[]
  sources: SourceType[]
}

const orcidKeys: {targetKey: keyof AggregatedPerson, sourceKey: keyof OrcidRecord}[] = [
  {targetKey: 'email_options', sourceKey: 'email'},
  {targetKey: 'affiliation_options', sourceKey: 'institution-name'}
]

const rsdKeys: {targetKey: keyof AggregatedPerson, sourceKey: keyof UniqueRsdPerson}[] = [
  {targetKey: 'email_options', sourceKey: 'email_address'},
  {targetKey: 'affiliation_options', sourceKey: 'affiliation'},
  {targetKey: 'avatar_options', sourceKey: 'avatar_id'},
  {targetKey: 'role_options', sourceKey: 'role'}
]

export function groupByOrcid(rsdPersons: UniqueRsdPerson[], orcidPersons: OrcidRecord[]) {
  try {
    const personsByOrcid: {[key: string]: AggregatedPerson} = {}
    const persons: AggregatedPerson[] = []

    // ORCID entries first
    orcidPersons.forEach(item => {
      if (personsByOrcid.hasOwnProperty(item['orcid-id']) === false) {
        const name = getDisplayName({
          given_names: item['given-names'],
          family_names: item['family-names']
        })
        // create new person
        const newPerson: AggregatedPerson = {
          // ORCID entry has no account (RSD account id)
          account: null,
          orcid: item['orcid-id'],
          display_name: name ?? 'Name missing',
          given_names: item['given-names'],
          family_names: item['family-names'],
          email_options: [],
          role_options: [],
          affiliation_options: [],
          avatar_options: [],
          sources:[]
        }
        // create new orcid entry
        personsByOrcid[item['orcid-id']] = newPerson
      }
      // get reference to existing entry
      let aggregatedPerson: AggregatedPerson = personsByOrcid[item['orcid-id']]
      // aggregate emails and affiliations
      orcidKeys.forEach(prop => {
        aggregatedPerson = addValueToObjectArray({
          target: aggregatedPerson,
          targetKey: prop.targetKey,
          source: item,
          sourceKey: prop.sourceKey,
        })
      })
      // add source
      aggregatedPerson.sources.push('ORCID')
    })

    rsdPersons.forEach(item => {
      if (item['orcid'] !== null) {
        if (personsByOrcid.hasOwnProperty(item['orcid']) === false) {
          // create new person
          const newPerson: AggregatedPerson = {
            account: item['account'],
            orcid: item['orcid'],
            display_name: item.display_name,
            given_names: item.given_names,
            family_names: item.family_names,
            email_options: [],
            role_options: [],
            affiliation_options: [],
            avatar_options: [],
            sources:[]
          }
          // create new orcid entry
          personsByOrcid[item['orcid']] = newPerson
        }
        // get reference to existing entry
        let aggregatedPerson: AggregatedPerson = personsByOrcid[item['orcid']]

        // aggregate email, affiliation and avatars
        rsdKeys.forEach(rsd => {
          aggregatedPerson = addValueToObjectArray({
            target: aggregatedPerson,
            targetKey: rsd.targetKey,
            source: item,
            sourceKey: rsd.sourceKey,
          })
        })
        // save RSD account to aggregated RSD person if missing
        if (item.account!==null && aggregatedPerson.account===null){
          aggregatedPerson.account = item.account
        }
        // add source
        if (aggregatedPerson.sources.includes('RSD') === false) {
          aggregatedPerson.sources.push('RSD')
        }
      } else {
        // entry without orcid
        let newPerson: AggregatedPerson = {
          account: item['account'],
          orcid: null,
          display_name: item.display_name,
          given_names: item.given_names,
          family_names: item.family_names,
          email_options: [],
          role_options:[],
          affiliation_options: [],
          avatar_options: [],
          sources: []
        }
        // aggregate email,affiliation and avatars
        rsdKeys.forEach(rsd => {
          newPerson = addValueToObjectArray({
            target: newPerson,
            targetKey: rsd.targetKey,
            source: item,
            sourceKey: rsd.sourceKey,
          })
        })
        // add source
        if (newPerson.sources.includes('RSD') === false) {
          newPerson.sources.push('RSD')
        }
        // add this entry direct to persons collection
        persons.push(newPerson)
      }
    })

    const keys = Object.keys(personsByOrcid)
    keys.forEach(orcid => {
      const person = personsByOrcid[orcid]
      persons.push(person)
    })

    return persons
  } catch (e: any) {
    logger(`groupByOrcid: ${e?.message}`, 'error')
    return []
  }
}

export function personsToAutocompleteOptions(persons:AggregatedPerson[]) {
  if (!persons) return []
  const options = persons.map(item => {
    return {
      key: item['account'] ?? item['orcid'] ?? `${item.display_name}`,
      label: item.display_name ?? '',
      data: item
    }
  })
  return options
}

type AddValueToObjectArrayProps<T, K extends keyof T, S, M extends keyof S> = {
  target: T
  targetKey: K,
  source: S,
  sourceKey: M
}

export function addValueToObjectArray<T, K extends keyof T, S, M extends keyof S>({
  target, targetKey, source, sourceKey}: AddValueToObjectArrayProps<T, K, S, M>) {
  try {
    if (source[sourceKey]) {
      if (typeof source[sourceKey] === 'string' && Array.isArray(target[targetKey]) === true) {
        // add string value to array
        const targetValues = target[targetKey] as string[]
        const sourceValue = source[sourceKey] as string
        // add only
        if (targetValues.includes(sourceValue) === false) {
          (target[targetKey] as any).push(source[sourceKey])
        }
      }
      if (Array.isArray(source[sourceKey]) === true && Array.isArray(target[targetKey]) === true) {
        // add array values to array
        const targetValues = target[targetKey] as string[]
        const sourceValues = source[sourceKey] as string[]

        sourceValues.forEach((value) => {
          if (targetValues.includes(value) === false) {
            // add new value
            (target[targetKey] as any).push(value)
          }
        })
      }
    }
    return target
  } catch (e: any) {
    logger(`AddValueToObjectArray...${e.message}`)
    return target
  }
}
