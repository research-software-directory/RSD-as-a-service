// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {Person} from '~/types/Contributor'

type UseContributorListProps={
  items: Person[]
  limit: number
}

export default function useContributorList({items,limit=12}:UseContributorListProps){
  const [persons, setPersons] = useState<Person[]>([])

  useEffect(()=>{
    let abort = false

    if (limit >= items.length && persons.length < items.length){
      // exit if hook is closed
      if (abort) return
      // show all items
      setPersons(items)
    }

    if (limit < items.length && persons.length !== limit){
      // exit if hook is closed
      if (abort) return
      // show only limited list
      setPersons(items.slice(0,limit))
    }

    return ()=>{abort=true}
  },[items,limit,persons])

  return {
    persons,
    hasMore: persons?.length < items?.length
  }
}
