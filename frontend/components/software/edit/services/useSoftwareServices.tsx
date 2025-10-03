// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSoftwareContext from '../context/useSoftwareContext'
import {getSoftwareServices, SoftwareServices} from './apiSoftwareServices'
import logger from '~/utils/logger'

export default function useSoftwareServices(){
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [services,setServices] = useState<SoftwareServices>()
  const [loading, setLoading] = useState(true)

  const loadServices = useCallback((abort:boolean)=>{
    if (token && software.id){
      getSoftwareServices(software.id,token)
        .then(item=>{
          if (abort===false) setServices(item)
        })
        .catch(e=>{
          logger(`useSoftwareServices failed. ${e.message}`,'error')
          if (abort===false) setServices(undefined)
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
    services,
    loadServices
  }
}
