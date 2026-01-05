// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {sortBySearchFor} from '~/utils/sortFn'
import logger from '~/utils/logger'
import {searchORCID} from '~/utils/getORCID'
import {TeamMember} from '~/types/Project'
import {Contributor} from '~/types/Contributor'
import {rsdPublicProfiles, rsdUniquePersonEntries, UniqueRsdPerson} from './findRSDPerson'
import {AggregatedPerson, groupByOrcid, personsToAutocompleteOptions} from './groupByOrcid'

export async function searchForPerson({searchFor,token,include_orcid=true}:
{searchFor: string,token:string,include_orcid?:boolean}) {
  try {

    const persons = await getAggregatedPersons({searchFor,token,include_orcid})
    const sortedPersons = persons.sort((a, b) => sortBySearchFor(a,b,'display_name',searchFor))
    const options = personsToAutocompleteOptions(sortedPersons)
    return options

  } catch (e: any) {
    logger(`searchForPerson: ${e?.message}`, 'error')
    return []
  }
}

export async function getAggregatedPersons({searchFor,token,include_orcid}:
{searchFor:string,token:string, include_orcid?:boolean}) {
  try {
    const [rsdPersons, orcidPersons, profiles] = await Promise.all([
      rsdUniquePersonEntries({searchFor, token, limit:30}),
      include_orcid ? searchORCID({searchFor, limit:30}) : [],
      rsdPublicProfiles({searchFor, limit:30})
    ])
    // aggregate contributors/team member and ORCID entries by ORCID
    const aggPersons = groupByOrcid(rsdPersons, orcidPersons)
    // console.log('getAggregatedPersons...aggPersons...', aggPersons)
    // use profile entries instead of aggPerson entries (where matched by account/orcid)
    const persons = joinPublicProfiles({aggPersons,profiles})
    // console.log('getAggregatedPersons...persons...', persons)
    return persons
  } catch (e: any) {
    logger(`getAggregatedPersons: ${e?.message}`, 'error')
    return []
  }
}

function joinPublicProfiles({aggPersons,profiles}:{
  aggPersons:AggregatedPerson[],profiles: UniqueRsdPerson[]
}){
  const persons:AggregatedPerson[] = []
  // exclude entries found in RSD profiles by account/orcid
  aggPersons.forEach(item=>{
    if (item.account || item.orcid){
      // can we find RSD profile for this person?
      const profile = profiles.find(profile=>{
        // debugger
        // profile found by account id
        if (item.account!==null &&
          profile.account === item.account) return true
        // profile found by ORCID
        if (item.orcid !== null &&
          profile.orcid === item.orcid) return true
        // no profile
        return false
      })
      // if not found in profiles by account or orcid
      if (!profile){
        // we add it to collection (those found will use profiles entry)
        persons.push(item)
      }
    }else{
      // if aggregatedPerson has no account and ORCID we cannot match with profile
      persons.push(item)
    }
  })
  // add all profiles found
  profiles.forEach(item=>{
    // replace this entry with profile
    persons.push({
      account: item.account,
      orcid: item.orcid,
      display_name: item.display_name,
      given_names: item.given_names,
      family_names: item.family_names,
      email_options: item.email_address ? [item.email_address] : [],
      role_options: item.role ? [item.role] : [],
      affiliation_options: item.affiliation ? [item.affiliation] : [],
      avatar_options: item.avatar_id ? [item.avatar_id]: [],
      sources:['RSD']
    })
  })
  return persons
}

export function personAlreadyPresent(collection:TeamMember[]|Contributor[],person:AggregatedPerson){
  const found = collection.find(item=>{
    if (item.account && person.account){
      return item.account === person.account
    }
    if (item.orcid && person.orcid){
      return item.orcid === person.orcid
    }
    return false
  })
  // true if person found in collection
  if (found) return true
  // otherwise false (not found)
  return false
}
