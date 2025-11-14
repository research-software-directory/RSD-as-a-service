// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import {getRepositoryInfoForSoftware, RepositoryForSoftware} from '~/components/software/edit/repositories/apiRepositories'

export default function useSoftwareServices(){
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [service , setService] = useState<RepositoryForSoftware>()
  const [loading, setLoading] = useState(true)

  const loadServices = useCallback((abort:boolean)=>{
    if (token && software.id){
      getRepositoryInfoForSoftware(software.id,token)
        .then(items=>{
          // select first repo for reporting services
          // NOTE! currently we show stats of first repo ONLY
          if (abort===false) setService(items[0])
        })
        .catch(e=>{
          logger(`useSoftwareServices failed. ${e.message}`,'error')
          if (abort===false) setService(undefined)
        })
        .finally(()=>{
          if (abort===false) setLoading(false)
        })
    }
  },[token,software.id])

  useEffect(()=>{
    let abort=false

    if (token && software.id){
      setLoading(true)
      loadServices(abort)
    }

    return ()=>{abort=true}
  },[token,software.id,loadServices])


  return {
    loading,
    service,
    loadServices
  }
}
