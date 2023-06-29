// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import logger from '~/utils/logger'
import {RsdUser, useSession} from '..'
import isMaintainerOfOrganisation from './isMaintainerOfOrganisation'

type UseOrganisationMaintainerProps = {
  organisation?: string
}

type IsOrganisationMaintainerProps = {
  organisation: string
  user: RsdUser | null
  token?: string
}

export async function isOrganisationMaintainer({organisation, user, token}: IsOrganisationMaintainerProps) {
  // if no token no check needed
  if (typeof token === 'undefined') return false
  // if organisation provided and user role rsd_admin
  if (organisation && user && user?.role === 'rsd_admin') {
    return true
  }
  // make request
  const isMaintainer = await isMaintainerOfOrganisation({
    organisation,
    account: user?.account ?? '',
    token
  })
  return isMaintainer
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
      if (organisation) {
        setLoading(true)
        const isMaintainer = await isMaintainerOfOrganisation({
          organisation,
          account: user?.account ?? '',
          token
        })
        if (abort) return
        setIsMaintainer(isMaintainer)
        setLoading(false)
      } else {
        logger('useOrganisationMaintainer...organisation UNDEFINED', 'warn')
        setIsMaintainer(false)
        // if (loading) setLoading(false)
      }
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
