// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {Session, useSession} from '..'
import isMaintainerOfOrganisation, {getMaintainerOrganisations} from './isMaintainerOfOrganisation'

type UseOrganisationMaintainerProps = {
  organisation: string
}

export default function useOrganisationMaintainer({organisation}: UseOrganisationMaintainerProps) {
  const {user,token,status} = useSession()
  const [isMaintainer, setIsMaintainer] = useState(false)
  const [loading, setLoading] = useState(true)

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
    } else if (isMaintainer===true) {
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

// returns a list of organisation ids (uuid) that this token is maintainer of
export function useMaintainerOfOrganisations({token}: { token: string }) {
  const [organisations, setOrganisations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function maintainerOfOrganisations() {
      const resp = await getMaintainerOrganisations({
        token,
        frontend:true
      })
      if (abort) return
      setOrganisations(resp)
      setLoading(false)
    }
    if (token) {
      maintainerOfOrganisations()
    }
    return ()=>{abort=true}
  }, [token])

  return {
    loading,
    organisations
  }
}
