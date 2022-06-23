// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {Session} from '..'
import isMaintainerOfOrganisation, {getMaintainerOrganisations} from './isMaintainerOfOrganisation'

type UseOrganisationMaintainerProps = {
  organisation: string
  session: Session
}

export default function useOrganisationMaintainer({organisation,session}:UseOrganisationMaintainerProps) {
  const [isMaintainer, setIsMaintainer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function organisationMaintainer() {
      setLoading(true)
      const isMaintainer = await isMaintainerOfOrganisation({
        organisation,
        account: session.user?.account ?? '',
        token: session.token,
        frontend: true
      })
      if (abort) return
      setIsMaintainer(isMaintainer)
      setLoading(false)
    }
    if (organisation &&
      session &&
      session.status === 'authenticated') {
      organisationMaintainer()
    } else if (isMaintainer===true) {
      // set to false if flag is true without
      setIsMaintainer(false)
    } else if (session && session?.status!=='loading'){
      setLoading(false)
    }
    return ()=>{abort=true}
  },[organisation,session, isMaintainer])

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
