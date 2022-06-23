// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import isMaintainerOfOrganisation from '~/auth/permissions/isMaintainerOfOrganisation'
import {EditOrganisation} from '../types/Organisation'
import {getOrganisationsForSoftware} from './editOrganisation'

type UseParticipatingOrganisationsProps = {
  software: string | undefined,
  token: string | undefined,
  account: string | undefined
}

export function useParticipatingOrganisations({software, token, account}: UseParticipatingOrganisationsProps) {
  const [organisations, setOrganisations] = useState<EditOrganisation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getOrganisations({software, token, account}:
      { software: string, token: string, account: string}) {
      const resp = await getOrganisationsForSoftware({
        software,
        token
      })
      // collect isMaintainerRequests
      const promises: Promise<boolean>[] = []
      // prepare organisation list
      const orgList = resp.map((item, pos) => {
        // save isMaintainer request
        promises.push(isMaintainerOfOrganisation({
          organisation: item.id,
          account,
          token,
          frontend: true
        }))
        // extract only needed props
        const organisation: EditOrganisation = {
          ...item,
          // additional props for edit type
          position:pos + 1,
          logo_b64:null,
          logo_mime_type:null,
          source:'RSD' as 'RSD',
          status:item.status,
          // false by default
          canEdit: false
        }
        return organisation
      })
      // run all isMaintainer requests in parallel
      const isMaintainer = await Promise.all(promises)
      const organisations = orgList.map((item, pos) => {
        // update canEdit based on isMaintainer requests
        if (isMaintainer[pos]) item.canEdit = isMaintainer[pos]
        return item
      })
      if (abort === true) return
      // update organisation list
      setOrganisations(organisations)
      // upadate loading state
      setLoading(false)
    }
    if (software && token && account) {
      getOrganisations({
        software,
        token,
        account
      })
    }
    () => { abort = true }
  }, [software, token, account])

  return {
    loading,
    organisations,
    setOrganisations
  }
}

export default useParticipatingOrganisations
