// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import useSoftwareContext from '../useSoftwareContext'
import {CitationState, getCitationsForSoftware} from './apiReferencePapers'

type UseCitationsForSoftwareProps = {
  search?:string | null
  page?:number | null,
  rows?:number | null
}

export default function useCitationsForSoftware({search,page=0,rows=12}:UseCitationsForSoftwareProps){
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<CitationState>()

  useEffect(() => {
    let abort = false
    async function getCitationsFromApi() {
      setLoading(true)
      const state = await getCitationsForSoftware({
        software: software.id,
        token,
        search,
        page,
        rows
      })
      if (abort === false) {
        // debugger
        setState(state)
        setLoading(false)
      }
    }
    if (software && token) {
      getCitationsFromApi()
    }
    return () => { abort = true }
  },[software,token,search,page,rows])

  // console.group('useCitationsForSoftware')
  // console.log('loading...', loading)
  // console.log('citationCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    ...state
  }
}
