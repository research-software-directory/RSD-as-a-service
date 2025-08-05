// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {isOrcid} from '~/utils/getORCID'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import {getAggregatedPersons} from '~/components/person/searchForPerson'
import useRoleOptions from './useRoleOptions'

export type AggregatedPersonOptions={
  avatars: string[],
  affiliations: string[],
  roles: string[],
  emails: string[]
}

export default function useAggregatedPerson(orcid:string|null){
  const {token} = useSession()
  const roles = useRoleOptions()
  const [aggregatedPerson, setAggregatedPerson] = useState<AggregatedPerson>()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let abort = false
    if (orcid && token && isOrcid(orcid)===true){
      // use getAggregatedPersons which can detected
      // that search term is ORCID and query RSD and ORCID accordingly
      getAggregatedPersons({searchFor:orcid,token})
        .then(persons=>{
          // we use first person that matches orcid,
          // it should be only one but just in case
          const person = persons.find(p=>p.orcid===orcid)
          if (abort===true) return
          setAggregatedPerson(person)
        })
        .finally(()=>setLoading(false))
    } else if (loading===true){
      setLoading(false)
    }
    return ()=>{abort=true}
  },[orcid,token,loading])

  const options:AggregatedPersonOptions = {
    avatars: aggregatedPerson?.avatar_options ?? [],
    affiliations: aggregatedPerson?.affiliation_options ?? [],
    emails: aggregatedPerson?.email_options ?? [],
    roles,
  }

  // console.group('useAggregatedPerson')
  // console.log('loading...', loading)
  // console.log('roles...', roles)
  // console.groupEnd()

  return {
    loading,
    options,
    aggregatedPerson
  }
}
