// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {isOrganisationMaintainer} from './isMaintainerOfOrganisation'


type UseOrganisationMaintainerProps = {
  organisation: string
}

export default function useOrganisationMaintainer({organisation}: UseOrganisationMaintainerProps) {
  const {user,token} = useSession()
  const [isMaintainer,setIsMaintainer] = useState(false)
  const [loading,setLoading] = useState(true)

  // console.group('useOrganisationMaintainer')
  // console.log('organisation...', organisation)
  // console.log('user...', user)
  // console.log('token...', token)
  // console.log('status...', status)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('loading...', loading)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function organisationMaintainer() {
      // console.log('organisationMaintainer...abort...',abort)
      const isMaintainer = await isOrganisationMaintainer({
        organisation,
        account: user?.account,
        role: user?.role,
        token
      })
      // console.log('abort...',abort)
      // console.log('organisationMaintainer...isMaintainer...',isMaintainer)
      if (abort) return
      setIsMaintainer(isMaintainer)
      setLoading(false)
    }
    if (organisation && user?.account && user?.role && token != '') {
      organisationMaintainer()
    } else if (abort === false) {

      setIsMaintainer(false)
      setLoading(false)
    }
    return ()=>{abort=true}
  },[organisation,user?.account,user?.role,token,loading,isMaintainer])

  return {
    loading,
    isMaintainer
  }
}
