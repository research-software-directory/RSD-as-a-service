// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSoftwareContext from '../context/useSoftwareContext'
import {getPackageManagerServices, PackageManagerService} from './apiSoftwareServices'
import logger from '~/utils/logger'


export default function usePackageManagerServices(){
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [services,setServices] = useState<PackageManagerService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let abort=false

    if (token && software.id){
      setLoading(true)

      getPackageManagerServices(software.id,token)
        .then(items=>{
          const supported = items.filter(item=>item.package_manager!=='other')
          if (abort===false) setServices(supported)
        })
        .catch(e=>{
          logger(`usePackageManagerServices failed. ${e.message}`,'error')
          if (abort===false) setServices([])
        })
        .finally(()=>{
          if (abort===false) setLoading(false)
        })
    }

    return ()=>{abort=true}
  },[token,software.id])


  return {
    loading,
    services
  }
}
