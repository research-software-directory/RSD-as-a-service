// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {sortBySearchFor} from '~/utils/sortFn'
import logger from '~/utils/logger'
import {searchORCID} from '~/utils/getORCID'
import {rsdUniquePersonEntries} from './findRSDPerson'
import {groupByOrcid, personsToAutocompleteOptions} from './groupByOrcid'

export async function searchForPerson({searchFor,token}:
  {searchFor: string,token:string}) {
  try {

    const persons = await getAggregatedPersons({searchFor,token})
    const sortedPersons = persons.sort((a, b) => sortBySearchFor(a,b,'display_name',searchFor))
    const options = personsToAutocompleteOptions(sortedPersons)
    return options

  } catch (e: any) {
    logger(`searchForPerson: ${e?.message}`, 'error')
    return []
  }
}

export async function getAggregatedPersons({searchFor,token}:
  {searchFor:string,token:string}) {
  try {
    const [rsdPersons, orcidPersons] = await Promise.all([
      rsdUniquePersonEntries({searchFor, token}),
      searchORCID({searchFor})
    ])
    // debugger
    const persons = groupByOrcid(rsdPersons, orcidPersons)
    // console.log('getAggregatedPersons...persons...', persons)
    return persons

  } catch (e: any) {
    logger(`getAggregatedPersons: ${e?.message}`, 'error')
    return []
  }
}
