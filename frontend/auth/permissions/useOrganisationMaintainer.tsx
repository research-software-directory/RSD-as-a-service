// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {useSession} from '..'
import isMaintainerOfOrganisation from './isMaintainerOfOrganisation'

type UseOrganisationMaintainerProps = {
  organisation: string
}

export default function useOrganisationMaintainer({organisation}: UseOrganisationMaintainerProps) {
  const {user,token,status} = useSession()
  const [isMaintainer, setIsMaintainer] = useState(false)
  const [loading, setLoading] = useState(true)

  // console.group('useOrganisationMaintainer')
  // console.log('organisation...', organisation)
  // console.log('status...', status)
  // console.log('loading...', loading)
  // console.log('1.isMaintainer...', isMaintainer)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function organisationMaintainer() {
      setLoading(true)
      const isMaintainer = await isMaintainerOfOrganisation({
        organisation,
        account: user?.account ?? '',
        token,
        frontend: true
      })
      if (abort) return
      setIsMaintainer(isMaintainer)
      setLoading(false)
    }
    if (organisation &&
      status === 'authenticated') {
      if (user?.role === 'rsd_admin') {
        if (abort) return
        setIsMaintainer(true)
        setLoading(false)
      } else {
        organisationMaintainer()
      }
    } else if (status !== 'authenticated' && isMaintainer === true) {
      // console.log('Set back to false')
      // set (back) to false
      setIsMaintainer(false)
    } else if (status!=='loading'){
      setLoading(false)
    }
    return ()=>{abort=true}
  },[organisation,user,status,token,isMaintainer])

  return {
    loading,
    isMaintainer
  }
}
